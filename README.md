Pi4eme — Business Intelligence & Accounting Platform

A full-stack BI and accounting management platform for companies, accountants, and admins — powered by AI.

🔗 Live Demo: https://pi4eme-1.vercel.app/sales

🚀 Project Status
ServiceStatusURLBackend (NestJS)✅ Runninghttp://localhost:3000Frontend (Angular)✅ Runninghttp://localhost:4200Database (MongoDB)✅ ConnectedPort 27017

🔐 Test Credentials (Auto-seeded)
The system is automatically initialized with the following accounts:
RoleEmailPassword🏢 Company Ownerowner@demo.comPassword123!🧾 Accountantaccountant@demo.comPassword123!🛡️ Adminadmin@bi.platformadmin123

⚙️ Setup & Installation
1. Environment Configuration
Create a .env file in the backend/ folder (use backend/.env.example as a reference):
envMONGODB_URI=mongodb://localhost:27017/pi4eme
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
ML_SERVICE_URL=http://localhost:5000
AI_AGENT_SERVICE_URL=http://localhost:5001
MAIL_HOST=smtp.example.com
MAIL_USER=your_email
MAIL_PASS=your_password
2. Install Dependencies
bash# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
3. Run the Services
bash# Backend — development mode
cd backend
npm run start:dev

# Frontend — Angular dev server
cd frontend
ng serve

# ML Service (Python)
cd ml-service
pip install -r requirements.txt
python app.py

# AI Agent Service (Python)
cd ai-agent-service
pip install -r requirements.txt
python app.py

🏗️ Architecture
Angular Frontend  (localhost:4200)
        │
        ▼
NestJS Backend API  (localhost:3000)
        │
   ┌────┴────┐
   │         │
   ▼         ▼
ML Service   AI Agent Service
(OCR/ML)     (Gemini Reports)
   │         │
   └────┬────┘
        ▼
    MongoDB  (port 27017)

🧠 AI Features

Invoice OCR — Upload a photo of an invoice; Tesseract extracts products, quantities, and prices automatically
AI Accountant Reports — Google Gemini generates structured financial reports with risks, opportunities, and action plans
ML Forecasting — Stockout prediction and sales forecasting from historical data


🛠️ Tech Stack
LayerTechnologyFrontendAngular (TypeScript)BackendNestJS (Node.js)AI AgentPython Flask + Google Gemini 1.5 FlashML / OCRPython Flask + Tesseract OCRDatabaseMongoDBAuthJWTDeploymentVercel

📁 Project Structure
Pi4eme/
├── frontend/          # Angular SPA
├── backend/           # NestJS REST API
├── ml-service/        # Python OCR & ML service
├── ai-agent-service/  # Python Gemini AI agent
└── mongodb-data/      # MongoDB seed data

Live at → https://pi4eme-1.vercel.app/sales
