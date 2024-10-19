interface WebsiteWebSocketEvents {
  handshake: HandshakeEventPayload;
  new: IInventoryEmit;
  removed: IInventoryEmit;
  update: IInventoryEmit;
  change_user: UserChangePayload;
  error: any;
  steamTrade: SteamTrade;
  inspect: any;
}
interface HandshakeEventPayload {
  id: string | null;
  message?: 'No authentication or session';
}
interface BaseNewEventPayload {
  game: string;
  classid?: number;
  steam_price?: number;
  item_id: string;
  price: number;
  name: string;
}
interface CSGOInventory {
  game: 'csgo';
  float: number;
  sticker_names: string[];
  paint_index: number;
}
interface UserChangePayload {
  wallet?: number;
  kyc_status?: string;
  name?: string;
  avatar?: string;
  ban?: boolean;
  last_login?: string;
}

interface TradeWebsocketCreateTrade {
  name: 'send-trade';
  data: TradeWebsocketCreateTradeData;
}

interface TradeWebsocketCreateTradeData {
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

interface TradeWebsocketCancelTrade {
  name: 'cancelTrade';
  data: TradeWebsocketCancelTradeData;
}

interface TradeWebsocketCancelTradeData {
  trade_id: string;
  seller_steamid: string;
}

interface TradeWebsocketAcceptWithdraw {
  name: string;
  data: TradeWebsocketAcceptWithdrawData;
}

interface TradeWebsocketAcceptWithdrawData {
  tradeid: string; //5525585555
  partner: string; //76561199059254XXX
}

interface TradeWebsocketChangeUser {
  name: 'change_user';
  data: UserOnlineChangePayload;
}

interface UserOnlineChangePayload {
  can_p2p: boolean;
}

enum WebsiteSocketSubEvents {
  add_item = 'add_item', // deprecated
  remove = 'remove', // deprecated
  csgo = 'csgo',
  rust = 'rust',
  dota2 = 'dota2',
  tf2 = 'tf2',
  update_item = 'update_item', // deprecated
}

enum WebsiteSocketEvents {
  add_item = 'add_item',
  remove = 'remove',
  update_item = 'update_item',
  handshake = 'handshake',
  updated_item = 'updated_item',
  change_user = 'change_user',
}

interface ItemChangeEvent {
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

interface UpdateItemEvent {
  price: number;
  item_id: string;
  name: string;
}
interface UpdatedItemEvent {
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
  user: UpdatedItemEventUser;
  for: UpdatedItemEventFor;
  seller: UpdatedItemEventSeller;
}

interface UpdatedItemEventSeller {
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

interface UpdatedItemEventFor {
  avatar: string;
  name: string;
  steam_level: number;
  steam_joined: number;
}

interface UpdatedItemEventUser {
  id: string;
  avatar: string;
  name: string;
  can_p2p: boolean;
}

interface SteamTrade {
  type: string;
  data: Data;
}

interface Data {
  id: string;
  stage: number;
  costum_id: string;
  creator: string;
  boxed: Date;
  send_until: Date;
  last_updated: Date;
  done: boolean;
  now: Date;
  user: User;
  merchant?: Merchant;
  seller: Seller;
  for: For;
  items: Item[];
}

interface For {
  name: string;
  avatar: string;
  kyc_status: null;
  steam_joined: number;
  steam_level: null;
}

interface Item {
  id: number;
  price: number;
  name: string;
  status: number;
  merchant: string | null;
  item_id: number;
  trade_id: string;
  image: string;
  sent_time: Date;
  inspect_item?: InspectItem;
  steam_prices?: SteamPrices;
}

interface InspectItem {
  floatvalue: number;
  rarity_name: string;
  stickers?: Sticker[];
}

interface Sticker {
  name: string;
  slot: number;
  wear: number;
  sticker_price?: StickerPrice;
}

interface StickerPrice {
  average: number;
  img: string;
}

interface SteamPrices {
  rarity_color: string;
  game_id: number;
  collection: string;
  collection_icon: string;
}

interface Merchant {
  merchant: string;
  avatar: string;
  currency_value: number;
  currency_icon: string;
  successlink: string;
}

interface Seller {
  id: string;
  name: string;
  avatar: string;
  can_p2p: boolean;
  kyc_status: null;
  shop: string;
  auto: boolean;
  success_trades: number;
  failed_trades: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  can_p2p: boolean;
  kyc_status: string;
}
