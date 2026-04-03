import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="chatbot-container" [class.open]="isOpen">
      <!-- Floating Button -->
      <button class="chat-toggle" (click)="toggleChat()" [attr.aria-label]="'Chat with AI'">
        <span class="chat-icon" *ngIf="!isOpen">💬</span>
        <span class="chat-icon close" *ngIf="isOpen">✕</span>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="isOpen">
        <header class="chat-header">
          <div class="header-info">
            <span class="status-dot"></span>
            <div>
              <h3>Tenexa AI Assistant</h3>
              <p>Online | Ready to help</p>
            </div>
          </div>
        </header>

        <main class="chat-messages" #scrollMe>
          <div class="message system">
            <div class="msg-bubble">
              Hello! I'm your Tenexa Assistant. Ask me anything about the dashboards, AI insights, or security features.
            </div>
          </div>

          <div *ngFor="let msg of messages" class="message" [class.user]="msg.role === 'user'">
            <div class="msg-bubble">
              {{ msg.content }}
            </div>
          </div>

          <div class="message system" *ngIf="loading">
            <div class="msg-bubble typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </main>

        <footer class="chat-footer">
          <form (ngSubmit)="sendMessage()">
            <input 
              type="text" 
              [(ngModel)]="userInput" 
              name="userInput" 
              placeholder="Ask about Tenexa..." 
              autocomplete="off"
              [disabled]="loading"
            />
            <button type="submit" [disabled]="!userInput.trim() || loading">
              ➔
            </button>
          </form>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container { position: fixed; bottom: 30px; right: 30px; z-index: 1000; font-family: 'Inter', sans-serif; }
    
    .chat-toggle {
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #052659 0%, #5483B3 100%);
      color: white; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(5,38,89,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .chat-toggle:hover { transform: scale(1.1) rotate(5deg); }
    .chat-icon { font-size: 28px; }
    .chat-icon.close { font-size: 22px; }

    .chat-window {
      position: absolute; bottom: 80px; right: 0;
      width: 360px; height: 500px; max-height: calc(100vh - 120px);
      background: var(--c-card); border: 1px solid var(--c-card-border);
      border-radius: 20px; box-shadow: var(--shadow-lg);
      display: flex; flex-direction: column; overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .chat-header {
      padding: 16px 20px; background: linear-gradient(135deg, #052659 0%, #5483B3 100%); color: white;
    }
    .header-info { display: flex; align-items: center; gap: 12px; }
    .status-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; border: 2px solid white; }
    .chat-header h3 { margin: 0; font-size: 15px; font-weight: 700; }
    .chat-header p { margin: 0; font-size: 11px; opacity: 0.8; }

    .chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; background: var(--c-bg); }
    .message { display: flex; width: 100%; }
    .message.user { justify-content: flex-end; }
    .msg-bubble { 
      max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.5;
      background: var(--c-card); border: 1px solid var(--c-card-border); color: var(--c-text);
      box-shadow: var(--shadow-sm); 
    }
    .message.user .msg-bubble { background: #052659; color: white; border: none; border-bottom-right-radius: 4px; }
    .message.system .msg-bubble { border-bottom-left-radius: 4px; }

    .chat-footer { padding: 16px; background: var(--c-card); border-top: 1px solid var(--c-card-border); }
    .chat-footer form { display: flex; gap: 10px; }
    .chat-footer input { 
      flex: 1; padding: 10px 14px; border-radius: 12px; border: 1.5px solid var(--c-input-border);
      background: var(--c-input-bg); color: var(--c-text); font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .chat-footer input:focus { border-color: var(--c-mid); }
    .chat-footer button { 
      width: 40px; height: 40px; border-radius: 10px; border: none;
      background: #052659; color: white; cursor: pointer; font-size: 18px;
    }
    .chat-footer button:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Typing Animation */
    .typing { display: flex; gap: 4px; padding: 12px 16px !important; }
    .dot { width: 6px; height: 6px; background: #5483B3; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

    @media (max-width: 480px) {
      .chat-window { width: calc(100vw - 40px); bottom: 70px; right: -10px; }
      .chatbot-container { bottom: 20px; right: 20px; }
    }
  `],
})

export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  isOpen = false;
  userInput = '';
  loading = false;
  lastRequestTime = 0;
  minRequestInterval = 2000;
  messages: { role: 'user' | 'assistant', content: string }[] = [];

  constructor(private api: ApiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.userInput.trim() || this.loading) return;

    const now = Date.now();
    if (now - this.lastRequestTime < this.minRequestInterval) {
      this.messages.push({ role: 'assistant', content: "Please wait a moment before sending another message." });
      return;
    }

    const message = this.userInput.trim();
    this.messages.push({ role: 'user', content: message });
    this.userInput = '';
    this.loading = true;
    this.lastRequestTime = now;

    this.api.askChatbot(message, this.messages.slice(0, -1)).subscribe({
      next: (res: any) => {
        this.messages.push({ role: 'assistant', content: res.response });
        this.loading = false;
      },
      error: (err) => {
        console.error('Chatbot error:', err);
        this.messages.push({ role: 'assistant', content: "I'm sorry, I'm having trouble communicating with the server. Please check your connection." });
        this.loading = false;
      }
    });
  }
}
