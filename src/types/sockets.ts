import { EGameId } from './waxpeer';

export interface TradeWebsocketCreateTrade {
  name: 'send-trade';
  data: TradeWebsocketCreateTradeData;
}

export interface TradeWebsocketCreateTradeData {
  waxid: string;
  wax_id: string;
  json_tradeoffer: TradeWebsocketCreateTradeJsonTradeoffer;
  tradeoffermessage: string;
  tradelink: string;
  partner: string;
  created: string;
  now: string;
  send_until: string;
}

interface TradeWebsocketCreateTradeJsonTradeoffer {
  newversion: boolean;
  version: number;
  me: TradeWebsocketCreateTradeSide;
  them: TradeWebsocketCreateTradeSide;
}

interface TradeWebsocketCreateTradeSide {
  assets: TradeWebsocketAsset[];
  currency: any[];
  ready: boolean;
}

interface TradeWebsocketAsset {
  appid: number;
  contextid: string;
  amount: number;
  assetid: string;
}

export interface TradeWebsocketCancelTrade {
  name: 'cancelTrade';
  data: TradeWebsocketCancelTradeData;
}

export interface TradeWebsocketCancelTradeData {
  trade_id: string;
  seller_steamid: string;
}

export interface TradeWebsocketAcceptWithdraw {
  name: string;
  data: TradeWebsocketAcceptWithdrawData;
}

export interface TradeWebsocketAcceptWithdrawData {
  trade_id: string;
  seller_steamid: string;
}

export enum WebsiteSocketSubEvents {
  add_item = 'add_item',
  remove = 'remove',
  update_item = 'update_item',
}

export enum WebsiteSocketEvents {
  add_item = 'add_item',
  remove = 'remove',
  update_item = 'update_item',
  handshake = 'handshake',
  updated_item = 'updated_item',
  change_user = 'change_user',
}

export interface ItemChangeEvent {
  name: string;
  market_name?: string;
  price: number;
  average: number;
  available: boolean;
  search_name?: string;
  image: string;
  steam_price: number;
  item_id: number | string;
  game?: keyof typeof EGameId;
}

export interface UpdateItemEvent {
  price: number;
  item_id: string;
  name: string;
}

export interface ChangeUserEvent {
  name: string;
  value?: number;
}

export interface UpdatedItemEvent {
  id: number;
  costum_id: string;
  project_id: string;
  trade_id: number;
  status: number;
  trade_message: string;
  tradelink: string;
  image: string;
  name: string;
  price: number;
  done: boolean;
  merchant?: any;
  item_id: string;
  stage: number;
  bar: number;
  for_steamid64: string;
  send_until: string;
  last_updated: string;
  now: string;
  user: User;
  for: For;
  seller: Seller;
}

interface Seller {
  id: string;
  avatar: string;
  name: string;
  can_p2p: boolean;
  shop: string;
  auto: boolean;
  success_trades: number;
  average_time: number;
  failed_trades: number;
}

interface For {
  avatar: string;
  name: string;
  steam_level: number;
  steam_joined: number;
}

interface User {
  id: string;
  avatar: string;
  name: string;
  can_p2p: boolean;
}
