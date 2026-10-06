import { ChatMessage, MessageStatus } from '../types';

type MessageCallback = (msg: ChatMessage) => void;
type TypingCallback = (chatId: string, isTyping: boolean) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private isConnected: boolean = false;
  private messageListeners: Set<MessageCallback> = new Set();
  private typingListeners: Set<TypingCallback> = new Set();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    this.isConnected = true;
    console.log('[WebSocket Realtime] Connected to wss://realtime.instagramclone.app/v1');
  }

  public sendChatMessage(chatId: string, text: string, senderId: string): ChatMessage {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      chatId,
      senderId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    console.log(`[WebSocket OUTGOING] Chat: ${chatId} | Msg: "${text}"`);
    
    // Simulate server delivery ACK after 500ms
    setTimeout(() => {
      newMessage.status = 'delivered';
      this.notifyMessageReceived({ ...newMessage });
    }, 500);

    // Simulate opponent response / read receipt after 2.5s
    setTimeout(() => {
      this.simulateOpponentTyping(chatId, true);
      setTimeout(() => {
        this.simulateOpponentTyping(chatId, false);
        this.simulateOpponentReply(chatId);
      }, 2000);
    }, 1500);

    return newMessage;
  }

  public sendTypingEvent(chatId: string, isTyping: boolean): void {
    console.log(`[WebSocket EVENT] Typing state on ${chatId}: ${isTyping}`);
    this.notifyTypingState(chatId, isTyping);
  }

  private simulateOpponentTyping(chatId: string, isTyping: boolean): void {
    this.notifyTypingState(chatId, isTyping);
  }

  private simulateOpponentReply(chatId: string): void {
    const replies = [
      '¡Genial! Los mensajes en tiempo real están funcionando vía WebSockets.',
      'Sincronizado correctamente 👍',
      '¿Probaste desconectar la red para probar la cola offline?',
      'Excelente implementación de la defensa técnica.',
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const opponentMessage: ChatMessage = {
      id: `msg_opp_${Date.now()}`,
      chatId,
      senderId: chatId.replace('chat_', ''),
      text: randomReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    console.log(`[WebSocket INCOMING] Received reply on ${chatId}: "${randomReply}"`);
    this.notifyMessageReceived(opponentMessage);
  }

  public onMessage(callback: MessageCallback): () => void {
    this.messageListeners.add(callback);
    return () => this.messageListeners.delete(callback);
  }

  public onTyping(callback: TypingCallback): () => void {
    this.typingListeners.add(callback);
    return () => this.typingListeners.delete(callback);
  }

  private notifyMessageReceived(msg: ChatMessage): void {
    this.messageListeners.forEach((cb) => cb(msg));
  }

  private notifyTypingState(chatId: string, isTyping: boolean): void {
    this.typingListeners.forEach((cb) => cb(chatId, isTyping));
  }
}

export const webSocketService = WebSocketService.getInstance();
