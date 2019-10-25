import RequestPromise from 'request-promise'
import { FetchInventory, GetItems, GetMySteamInv, IUser, ListedItem, ListItems, ReadyToTransfer } from './types/waxpeer'

export class Waxpeer {
  private api: string
  public baseUrl = 'https://api.waxpeer.com'
  public version = 'v1'
  constructor(api: string) {
    this.api = api
  }
  public async sleep(timer: number) {
    await new Promise(res => setTimeout(res, timer))
  }

  /**
   * 
   * @param steam_api Your steam API that is linked to waxpeer account
   */
  public getTradesToSend(steam_api: string): Promise<ReadyToTransfer> {
    return this.get('ready-to-transfer-p2p', `steam_api = ${steam_api}`)
  }

  /**
   * 
   * @param skip How many items you want to skip
   * @param limit How many items you want to fetch (max 100)
   * @param game Game (csgo,dota2,vgo and etc check https://api.waxpeer.com/docs/#/Steam/get_get_items_list)
   */
  public getItemsList(skip: number = 0, limit: number = 10, game: string = 'csgo'): Promise<GetItems> {
    return this.get('get-items-list', `game=${game}&skip=${skip}&limit=${limit}`)
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
    let searchNames = names.map(i => `name=${encodeURIComponent(i)}`).join('&')
    return this.get('search-items-by-nam', searchNames)
  }


  /**
   * 
   * @param name Name of an item you want to search
   */
  public searchItem(name: string): Promise<GetItems> {
    return this.get('search-by-name', `name=${encodeURIComponent(name)}`)
  }

  public getProfile(): Promise<IUser> {
    return this.get('user')
  }

  public async post<T = object>(url: string, body: any) {
    let { baseUrl, api, version } = this
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`
    let opt = { method: 'POST', body: body }

    return await this.request<T>(newUrl, opt)
  }

  public async get<T = object>(url: string, token?: string) {
    let { baseUrl, api, version } = this
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`
    if (token) newUrl += `&${token}`
    try {
      return await this.request<T>(newUrl)
    } catch (e) {
      return null
    }
  }
  public async request<T = object>(url: string, opt?: RequestPromise.RequestPromiseOptions) {
    try {
      return <T>JSON.parse(await RequestPromise(url, opt))
    } catch (e) {
      await this.sleep(5000)
      return await this.request(url, opt)
    }
  }
}