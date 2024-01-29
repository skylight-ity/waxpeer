import EventEmitter from 'events';
import io from 'socket.io-client';
import {
  WebsiteSocketSubEvents,
  WebsiteWebSocketEvents,
} from '../types/sockets';

export class WebsiteWebsocket extends EventEmitter {
  private apiKey: string;
  public socketOpen = false;
  public subEvents: Array<keyof typeof WebsiteSocketSubEvents> = [];
  constructor(
    apiKey?: string,
    subEvents: Array<keyof typeof WebsiteSocketSubEvents> = []
  ) {
    super();
    this.apiKey = apiKey;
    this.connectWss();
    this.subEvents = subEvents;
  }
  async connectWss() {
    const socket = io('wss://waxpeer.com', {
      transports: ['websocket'],
      path: '/socket.io/',
      autoConnect: true,
      extraHeaders: {
        authorization: this.apiKey,
      },
    });

    socket.on('connect', () => {
      this.socketOpen = true;
      this.subEvents.map((e) => socket.emit('subscribe', { name: e }));
      console.log('WebsiteWebsocket connected');
    });
    socket.on('error', (err) => this.emit('error', err));
    socket.on('disconnect', () => {
      this.socketOpen = false;
      console.log('WebsiteWebsocket disconnected');
    });
    socket.on('handshake', (data) => {
      this.emit('handshake', data);
    });
    socket.on('new', (data) => this.emit('new', data));
    socket.on('update', (data) => this.emit('update', data));
    socket.on('removed', (data) => this.emit('removed', data));
    socket.on('steamTrade', (data) => this.emit('steamTrade', data));

    socket.on('change_user', (data) => {
      this.emit('change_user', data);
    });
    socket.on('connect_error', (err) => {
      this.socketOpen = false;
      console.log('connect_error', err);
    });
  }
  on<K extends keyof WebsiteWebSocketEvents>(
    event: K,
    listener: (payload: WebsiteWebSocketEvents[K]) => void
  ): this {
    return super.on(event, listener);
  }
}
