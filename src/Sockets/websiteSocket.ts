import EventEmitter from 'events';
import io from 'socket.io-client';
import { ItemChangeEvent, WebsiteSocketSubEvents } from '../types/sockets';

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
      this.subEvents.map((sub) => {
        socket.emit('sub', { name: sub, value: true });
      });
      console.log('WebsiteWebsocket connected');
    });
    socket.on('disconnect', () => {
      this.socketOpen = false;
      console.log('WebsiteWebsocket disconnected');
    });
    socket.on('handshake', (data) => {
      this.emit('handshake', data);
    });
    socket.on('add_item', (data: ItemChangeEvent) => {
      this.emit('add_item', data);
    });
    socket.on('update_item', (data) => {
      this.emit('update_item', data);
    });
    socket.on('updated_item', (data) => {
      this.emit('updated_item', data);
    });
    socket.on('steamTrade', (data) => this.emit('steamTrade', data));
    socket.on('remove', (data) => {
      this.emit('remove_item', data);
    });
    socket.on('change_user', (data) => {
      this.emit('change_user', data);
    });
    socket.on('connect_error', (err) => {
      this.socketOpen = false;
      console.log('connect_error', err);
    });
  }
}
