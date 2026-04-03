import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnalyticsService } from '../analytics/analytics.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private readonly modelName = 'gemini-2.5-flash-lite';

  constructor(
    private readonly configService: ConfigService,
    private readonly analyticsService: AnalyticsService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.error('CRITICAL: GEMINI_API_KEY is not defined in environment.');
    }
  }

  private readonly systemPrompt = `You are Tenexa Assistant, a specialized AI for the Tenexa Business Intelligence Platform.
      
      Project Features & Context:
      - **Dashboard Overview**: Tenexa provides real-time Sales and Purchases tracking.
      - **Sales Dashboard**: Track revenue, top products, and customers.
      - **Purchases Dashboard**: Track supplier spending and stock levels.
      - **AI Features**:
        - **Stockout Risk**: Predicts when products will run out.
        - **Reorder Recommendation**: Suggests how much to buy (with 25% safety margin).
        - **Health Score**: A 0-100 score based on 6 factors (Margin, Trend, Efficiency, etc.).
        - **Revenue Forecast**: Uses Linear Regression ML to predict the next 7 days.
        - **Product Performance**: Categorizes products (Top Performer, Rising Star, Declining, etc.).
      - **Security**: Features Face Identification and 2FA.
      - **UI/UX**: Supports English, Arabic, and French.

      How to Use the App (FAQs):
      - **How to create an account?**: 
        1. Click on the **Sign Up** link on the login page.
        2. Fill in your details (Name, Email, Password, Company Name).
        3. You can also sign up using your **GitHub account**.
        4. After signing up, you will receive an **email verification link**. Click it to activate your account.
        5. Once verified, you can log in and start using the platform.
      - **How to upload a CSV?**: 
        1. Navigate to the **Sales Dashboard** or **Purchases Dashboard**.
        2. Look for the "Upload Sales CSV" or "Upload Purchases CSV" card.
        3. You can either **Drag & Drop** your .csv file into the box or **click the "Upload CSV" button** to select a file from your computer.
        4. Once uploaded, your dashboard charts will update automatically.
      - **Where are the AI insights?**: 
        - Stockout risks and reorder suggestions are on the **Purchases Dashboard**.
        - Revenue forecasts and Health Score are on the **Report/Analytics Dashboard**.
        - Product performance classification is on the **Sales Dashboard**.
      - **Business Analytics**: Ask me about your **profit**, **user count**, **customer count**, or **company info** and I will provide real-time data from your database.
      - **Security**: You can enable 2FA or Face ID in your **Profile/Settings**.
      
      Your Role:
      - Answer questions accurately about Tenexa's features, how to use the app, and provide data-driven insights about requester's business.
      - **Direct Responses**: When a user asks about their business (profit, orders, best-selling products, etc.), use the data provided in the "Additional Context" to answer **directly** and **concisely**. Do not ask for confirmation or tell them to check a dashboard if the answer is already in the context.
      - Be professional, helpful, and concise.`;

  async getChatResponse(message: string, history: any[] = [], req?: any) {
    if (!this.genAI) return 'Chatbot is not configured.';

    const companyId = req?.user?.companyId;
    let additionalContext = '';
    if (companyId) {
        const lowerMsg = message.toLowerCase();
        const needsData = lowerMsg.includes('profit') || lowerMsg.includes('loss') || lowerMsg.includes('score') || lowerMsg.includes('user') || lowerMsg.includes('customer') || lowerMsg.includes('order') || lowerMsg.includes('sale') || lowerMsg.includes('total');
        
        if (needsData) {
            try {
                if (lowerMsg.includes('score')) {
                    const score = await this.analyticsService.getHealthScore(companyId).catch(() => null);
                    if (score) additionalContext += `Health Score: ${JSON.stringify(score)}\n`;
                }
                const overview = await this.analyticsService.getCompanyOverview(companyId);
                if (overview) additionalContext += `Real-time Business Summary: ${JSON.stringify(overview)}\n`;
            } catch (e) {
                additionalContext += 'Error fetching real-time business data.\n';
            }
        }
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      
      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      });

      const fullPrompt = `${this.systemPrompt}${additionalContext ? '\n\nAdditional Context:\n' + additionalContext : ''}\n\nUser Question: ${message}`;
      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      return response.text();

    } catch (error: any) {
      console.error('[ChatService] SDK Error:', error.message);
      return `Chat Error: ${error.message}`;
    }
  }
}
