export interface ReadyToTransfer {
  success?: boolean;
  trades?: Trade[];
}

export interface Trade {
  id?: number;
  costum_id?: string;
  trade_id?: number;
  status?: string;
  trade_message?: string;
  tradelink?: string;
  done?: boolean;
  for_steamid32?: string;
  for_steamid64?: string;
  created?: string;
  send_until?: string;
  items?: Item[];
}

export interface Item {
  id?: number;
  item_id?: string;
  give_amount?: number;
  image?: string;
  price?: number;
  game?: string;
  name?: string;
  status?: number;
}

export interface GetItems {
  success?: boolean;
  items?: Datum[];
}

export interface Datum {
  name?: string;
  price?: number;
  selling?: boolean;
  opskins_id?: number
  image?: string;
  item_id?: string;
}
export interface FetchInventory {
  success: boolean;
  msg?: string;
}

export interface ListItems {
  success: boolean;
  msg?: string;
  items?: ListedItem[];
}

export interface ListedItem {
  item_id?: number;
  price?: number;
}


export interface GetMySteamInv {
  success?: boolean;
  items?: SteamInvItem[];
  count?: number;
  msg?: string;
}

export interface SteamInvItem {
  item_id?: string;
  color?: string;
  type?: string;
  market_name?: string;
  steam_price?: SteamPrice;
}

export interface SteamPrice {
  name?: string;
  average?: number;
  img?: string;
}
export interface IUser {
  success?: boolean;
  user?: User;
}

export interface User {
  wallet?: number;
  id?: string;
  id64?: string;
  avatar?: string;
  name?: string;
  sell_fees?: number;
  can_p2p?: boolean;
  eth_wallet?: string;
  btc_wallet?: string;
  ltc_wallet?: string;
  tradelink?: string;
  expresslink?: string;
}

export interface ISetMyKeys {
  success?: boolean
  msg?: string
}