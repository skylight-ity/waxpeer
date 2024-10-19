import EventEmitter from 'events';
import io, { Socket } from 'socket.io-client';

export class WebsiteWebsocket extends EventEmitter {
  private apiKey: string;
  private socket: Socket | null;
  public socketOpen = false;
  public subEvents: Array<keyof typeof WebsiteSocketSubEvents> = [];
  constructor(apiKey?: string, subEvents: Array<keyof typeof WebsiteSocketSubEvents> = []) {
    super();
    this.apiKey = apiKey;
    this.socket = null;
    this.connectWss();
    this.subEvents = subEvents;
  }
  async connectWss() {
    this.socket = io('wss://waxpeer.com', {
      transports: ['websocket'],
      path: '/socket.io/',
      autoConnect: true,
      extraHeaders: {
        authorization: this.apiKey,
      },
    });

    this.socket.on('connect', () => {
      this.socketOpen = true;
      this.subEvents.map((e) => this.socket?.emit('subscribe', { name: e }));
      console.log('WebsiteWebsocket connected');
    });
    this.socket.on('error', (err) => this.emit('error', err));
    this.socket.on('disconnect', () => {
      this.socketOpen = false;
      console.log('WebsiteWebsocket disconnected');
    });
    this.socket.on('handshake', (data) => {
      this.emit('handshake', data);
    });
    this.socket.on('new', (data) => this.emit('new', data));
    this.socket.on('update', (data) => this.emit('update', data));
    this.socket.on('removed', (data) => this.emit('removed', data));
    this.socket.on('steamTrade', (data) => this.emit('steamTrade', data));

    this.socket.on('change_user', (data) => {
      this.emit('change_user', data);
    });
    this.socket.on('connect_error', (err) => {
      this.socketOpen = false;
      console.log('connect_error', err);
    });
  }
  disconnectWss() {
    if (this.socket) {
      this.socket.disconnect();
      this.socketOpen = false;
    }
  }
  on<K extends keyof WebsiteWebSocketEvents>(event: K, listener: (payload: WebsiteWebSocketEvents[K]) => void): this {
    return super.on(event, listener);
  }
}
