export interface ReadyToTransfer {
  success?: boolean
  trades?: Trade[]
}

export interface Trade {
  id?: number
  costum_id?: string
  trade_id?: number
  status?: string
  trade_message?: string
  tradelink?: string
  done?: boolean
  for_steamid32?: string
  for_steamid64?: string
  created?: string
  send_until?: string
  items?: Item[]
}

export interface Item {
  id?: number
  item_id?: string
  give_amount?: number
  image?: string
  price?: number
  game?: string
  name?: string
  status?: number
}

export interface GetItems {
  success?: boolean
  items?: Datum[]
}

export interface Datum {
  item_id?: string
  image?: string
  price?: number
  name?: string
  steam_price?: number
  position: number
  best_deals?: number
  discount?: number
}
export interface FetchInventory {
  success: boolean
  msg?: string
}

export interface ListItems {
  success: boolean
  msg?: string
  items?: IListItem[]
}
export interface IListItem {
  item_id?: number
  price?: number
  position: number
}
export interface ListedItem {
  item_id?: number
  price?: number
}

export interface GetMySteamInv {
  success?: boolean
  items?: SteamInvItem[]
  count?: number
  msg?: string
}

export interface SteamInvItem {
  item_id?: string
  color?: string
  type?: string
  market_name?: string
  steam_price?: SteamPrice
}

export interface SteamPrice {
  name?: string
  average?: number
  img?: string
}
export interface IUser {
  success?: boolean
  user?: User
}

export interface User {
  wallet?: number
  id?: string
  id64?: string
  avatar?: string
  name?: string
  sell_fees?: number
  can_p2p?: boolean
  eth_wallet?: string
  btc_wallet?: string
  ltc_wallet?: string
  tradelink?: string
  expresslink?: string
  user_id?: string
}

export interface ISetMyKeys {
  success?: boolean
  msg?: string
}

export interface IBuy {
  success: boolean
  msg?: string
  id?: number
}

export interface TradesStatus {
  success?: boolean
  trades?: TradeRecive[]
}

export interface TradeRecive {
  price?: number
  reason?: string
  trade_id?: string
  for_steamid64?: string
  id?: string
  name?: string
  status?: number
  done?: boolean
  send_until?: number
  last_updated?: number
  counter?: number
}
// Generated by https://quicktype.io

export interface IBuyMyHistory {
  success: boolean
  history: History[]
}

export interface History {
  trade_id: null | string
  token: string
  partner: number
  created: string
  send_until: string
  reason: Reason
  id: number
  item_id: string
  image: string
  price: number
  name: string
  status: number
}

export enum Reason {
  Accepted = 'Accepted',
  BuyerFailedToAccept = 'Buyer failed to accept',
  ItemPriceHasIncreasedOrItemIsNoLongerAvailable = 'Item price has increased or item is no longer available',
  SellerFailedToAccept = 'Seller failed to accept',
}
// Generated by https://quicktype.io

export interface IPrices {
  success: boolean
  items: Item[]
}

export interface Item {
  name?: string
  max: number
  avg: number
  count: string
  min: number
}
// Generated by https://quicktype.io

export interface ICheckLink {
  success: boolean
  msg: string
  link: string
  token: string
  steamid32: string
}
export interface IEditItemsReq {
  item_id: number
  price: number
}
export interface IResponseEdit {
  updated: IResponseEditItem[]
  success: boolean
  failed: IFailedEdit[]
  removed: number[]
}
export interface IResponseEditItem {
  item_id: number
  price: number
  position: number
}
interface IFailedEdit {
  item_id: number
  msg: string
  name: string
}
export interface IListedItem {
  item_id: number
  price: number
  position: number
  name: string
  date: string
  steam_price: ISteamPrice
}
export interface ISteamPrice {
  average: number
  current: number
  img: string
}
export interface ISteamInfoItem {
  name: string
  average: number
  type: string
  collection: string
  ru_name: string
}
export interface IAvailable {
  name: string
  price: number
  selling: true
  image: string
  item_id: string
}
