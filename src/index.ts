import RequestPromise from 'request-promise'
import { FetchInventory, GetItems, GetMySteamInv, IBuy, ISetMyKeys, IUser, ListedItem, ListItems, ReadyToTransfer, TradesStatus } from './types/waxpeer'

export class Waxpeer {
  private api: string
  public baseUrl = 'https://api.waxpeer.com'
  public version = 'v1'
  private steam_api
  private proxy;

  constructor(api: string, steam_api?: string, proxy?: string) {
    this.api = api
    this.proxy = proxy;
    if (steam_api)
      this.steam_api = steam_api
  }
  public async sleep(timer: number) {
    await new Promise(res => setTimeout(res, timer))
  }


  /**
   * 
   * @param name Market hash name of the item
   * @param price Price, should be greater than item price
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   */
  public buyItemWithName(name: string, price: number, token: string, partner: string): Promise<IBuy> {
    return this.get('buy-one-p2p-name', 'v1', `name=${encodeURIComponent(name)}&price=${price}&token=${token}&partner=${partner}`)
  }

  /**
   * 
   * @param item_id Item id from fetching items
   * @param price Price of the item 1$=1000
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   */
  public buyItemWithId(item_id: number, price: number, token: string, partner: string): Promise<IBuy> {
    return this.get('buy-one-p2p', 'v1', `item_id=${item_id}&price=${price}&token=${token}&partner=${partner}`)
  }

  /**
   * 
   * @param ids Ids or id that you recived when purchasing items
   */
  public tradeRequestStatus(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = []
    if (typeof ids !== 'object')
      id = [ids]
    else
      id = [...ids]
    return this.get('check-many-steam', 'v1', id.map(i => `id=${i}`).join('&'))
  }

  /**
   * 
   * @param steam_api (optional) you can pass a steam api to waxpeer 
   */
  public setMyKeys(steam_api?: string): Promise<ISetMyKeys> {
    return this.get('set-my-steamapi', 'v1', `steam_api=${steam_api ? steam_api : this.steam_api}&api=${this.api}`)
  }

  /**
   * 
   * @param steam_api Your steam API that is linked to waxpeer account
   */
  public getTradesToSend(steam_api?: string): Promise<ReadyToTransfer> {
    return this.get('ready-to-transfer-p2p', 'v2', `steam_api=${steam_api ? steam_api : this.steam_api}`)
  }

  /**
   * 
   * @param skip How many items you want to skip
   * @param limit How many items you want to fetch (max 100)
   * @param game Game (csgo,dota2,vgo and etc check https://api.waxpeer.com/docs/#/Steam/get_get_items_list)
   * @param min_price Min price 1$=1000
   * @param max_price Max price
   * @param sort The order in which items are returned in (profit, desc, asc, best_deals)
   * @param minified If you pass this you will recieve additional info like float. Available values : 1, 2
   */
  public getItemsList(skip: number = 0, limit: number = 50, game: string = 'csgo', discount: number = 0, min_price: number = 0, max_price: number = 10000000, sort: string = 'desc', minified : number = 0): Promise<GetItems> {
    return this.get('get-items-list', `game=${game}&skip=${skip}&limit=${limit}&discount=${discount}&min_price=${min_price}&max_price=${max_price}&sort=${sort}&minified=${minified}`)
  }

  /**
   * Fetches your steam inventory make sure your steamid is connected on waxpeer
   */
  public fetchInventory(): Promise<FetchInventory> {
    return this.get('fetch-my-inventory')
  }

  /**
   * 
   * @param items Items object  https://api.waxpeer.com/docs/#/Steam/post_list_items_steam
   */
  public listItemsSteam(items: ListedItem[]): Promise<ListItems> {
    return this.post('list-items-steam', items)
  }

  /**
   * 
   * @param skip Skip items
   * @param game Game
   */
  public getMyInventory(skip: number = 0, game: string = 'csgo'): Promise<GetMySteamInv> {
    return this.get('get-my-inventory', `game=${game}&skip=${skip}`)
  }

  /**
   * 
   * @param names Array of item names
   */
  public searchItems(names: string[]): Promise<GetItems> {
    let searchNames = names.map(i => `names=${encodeURIComponent(i)}`).join('&')
    return this.get('search-items-by-name', searchNames)
  }


  /**
   * 
   * @param name Name of an item you want to search
   */
  public searchItem(name: string): Promise<GetItems> {
    return this.get('search-by-name', `name=${encodeURIComponent(name)}`)
  }

  /**
   * Get Profile data
   */
  public getProfile(): Promise<IUser> {
    return this.get('user')
  }

  public async post<T = object>(url: string, body: any) {
    let { baseUrl, api, version } = this
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`
    let opt = { method: 'POST', body: body }

    return await this.request<T>(newUrl, opt)
  }

  public async get<T = object>(url: string, v: string = 'v1', token?: string) {
    let { baseUrl, api, version } = this
    let newUrl = `${baseUrl}/${v ? v : version}/${url}?api=${api}`
    if (token) newUrl += `&${token}`
    try {
      return await this.request<T>(newUrl)
    } catch (e) {
      throw e
    }
  }


  public async request<T = object>(url: string, opt?: RequestPromise.RequestPromiseOptions) {
    try {
      return <T>JSON.parse(await RequestPromise(url, {...opt, proxy: this.proxy}))
    } catch (e) {
      throw e
    }
  }
}
