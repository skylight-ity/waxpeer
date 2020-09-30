import axios from 'axios'
import {
  FetchInventory,
  GetItems,
  GetMySteamInv,
  IAvailable,
  IBuy,
  IBuyMyHistory,
  ICheckLink,
  IEditItemsReq,
  IListedItem,
  IPrices,
  IResponseEdit,
  ISetMyKeys,
  ISteamInfoItem,
  IUser,
  ListedItem,
  ListItems,
  TradesStatus,
} from './types/waxpeer'

export class Waxpeer {
  private api: string
  public baseUrl = 'https://api.waxpeer.com'
  public version = 'v1'
  constructor(api: string, baseUrl?: string) {
    this.api = api
    if (baseUrl) this.baseUrl = baseUrl
  }
  public async sleep(timer: number) {
    await new Promise((res) => setTimeout(res, timer))
  }

  /**
   *
   * @param name Market hash name of the item
   * @param price Price, should be greater than item price
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   * @param project_id Your custom id string[50]
   */
  public buyItemWithName(
    name: string,
    price: number,
    token: string,
    partner: string,
    project_id?: string,
  ): Promise<IBuy> {
    return this.get(
      'buy-one-p2p-name',
      `name=${encodeURIComponent(name)}&price=${price}&token=${token}&partner=${partner}${
        project_id ? `&project_id=${project_id}` : ''
      }`,
    )
  }

  /**
   *
   * @param item_id Item id from fetching items
   * @param price Price of the item 1$=1000
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   * @param project_id Your custom id string[50]
   */
  public buyItemWithId(
    item_id: number,
    price: number,
    token: string,
    partner: string,
    project_id?: string,
  ): Promise<IBuy> {
    return this.get(
      'buy-one-p2p',
      `item_id=${item_id}&price=${price}&token=${token}&partner=${partner}${
        project_id ? `&project_id=${project_id}` : ''
      }`,
    )
  }

  /**
   *
   * @param ids Ids or id that you recived when purchasing items
   */
  public tradeRequestStatus(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = []
    if (typeof ids !== 'object') id = [ids]
    else id = [...ids]
    return this.get('check-many-steam', id.map((i) => `id=${i}`).join('&'))
  }

  /**
   *
   * @param ids Ids or id that you passed as project_id when making a purchase
   */
  public customTradeRequest(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = []
    if (typeof ids !== 'object') id = [ids]
    else id = [...ids]
    return this.get('check-many-project-id', id.map((i) => `id=${i}`).join('&'))
  }
  /**
   *
   * @param steam_api (optional) you can pass a steam api to waxpeer
   */
  public setMyKeys(steam_api: string): Promise<ISetMyKeys> {
    return this.get('set-my-steamapi', `steam_api=${steam_api}&api=${this.api}`)
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
  public getItemsList(
    skip: number = 0,
    limit: number = 50,
    game: string = 'csgo',
    discount: number = 0,
    min_price: number = 0,
    max_price: number = 10000000,
    sort: string = 'desc',
    minified: number = 0,
  ): Promise<GetItems> {
    return this.get(
      'get-items-list',
      `game=${game}&skip=${skip}&limit=${limit}&discount=${discount}&min_price=${min_price}&max_price=${max_price}&sort=${sort}&minified=${minified}`,
    )
  }

  /**
   * Fetches your steam inventory make sure your steamid is connected on waxpeer
   */
  public fetchInventory(): Promise<FetchInventory> {
    return this.get('fetch-my-inventory')
  }

  public getSteamItems(game: string = 'csgo'): Promise<{ success: boolean; items: ISteamInfoItem[] }> {
    let gameId = game === 'csgo' ? 730 : 570
    return this.get('get-steam-items', `game=${gameId}`)
  }
  /**
   * Get min price,name,max_price,average price for all items
   * @param game Game csgo,dota2,gc
   * @param min_price Min price
   * @param max_price Max price
   * @param search search
   */
  public getPrices(game = 'csgo', min_price?: number, max_price?: number, search?: string): Promise<IPrices> {
    return this.get(
      `prices`,
      `game=${game}&${min_price ? `min_price=${min_price}` : ''}${max_price ? `max_price=${max_price}` : ''}${
        search ? encodeURIComponent(search) : ''
      }`,
    )
  }

  /**
   * It will validate tradelink and also cache it on waxpeer side so your purchase will be made instantly
   * @param tradelink Full tradelink that you want to validate
   */
  public validateTradeLink(tradelink: string): Promise<ICheckLink> {
    return this.post(`check-tradelink`, { tradelink })
  }

  /**
   * Check weather items are available by item_id max 50 items
   * @param item_id ItemIds that you want to check weather items are available
   */
  public checkItemAvailability(
    item_id: string | number | string[] | number[],
  ): Promise<{ success: boolean; data: IAvailable[] }> {
    let ids = typeof item_id === 'object' ? item_id : [item_id]
    return this.get(`check-availability`, ids.map((i) => `item_id=${i}`).join('&'))
  }
  /**
   * Edit multiple items or set price to 0 to remove
   * @param items Array of items with item_id and price keys
   */
  public editItems(items: IEditItemsReq[]): Promise<IResponseEdit> {
    return this.post(`edit-items`, {
      items,
    })
  }

  /**
   *
   * @param items Items object  https://api.waxpeer.com/docs/#/Steam/post_list_items_steam
   */
  public listItemsSteam(items: ListedItem[]): Promise<ListItems> {
    return this.post('list-items-steam', {
      items,
    })
  }

  /**
   *
   */
  public myListedItems(game: string = 'csgo'): Promise<{ success: boolean; items: IListedItem[] }> {
    return this.get('list-items-steam', `game=${game ? game : 'csgo'}`)
  }

  /**
   *
   * @param skip Skip items
   * @param game Game
   */
  public getMyInventory(skip: number = 0, game: string = 'csgo'): Promise<GetMySteamInv> {
    let gameId = game === 'csgo' ? 730 : game === 'dota2' ? 570 : 440
    return this.get('get-my-inventory', `game=${gameId}&skip=${skip}`)
  }

  /**
   *
   * @param names Array of item names
   */
  public searchItems(names: string[] | string): Promise<GetItems> {
    let nameSearch = typeof names === 'object' ? names : [names]
    let searchNames = nameSearch.map((i) => `names=${encodeURIComponent(i)}`).join('&')
    return this.get('search-items-by-name', searchNames)
  }
  /**
   *
   * @param skip skip since by default it returns 50 items
   * @param partner partner parameter that you passed when buying
   * @param token token parameter that you passed when buying
   */
  public myPurchases(skip = 0, partner?: string, token?: string): Promise<IBuyMyHistory> {
    return this.get(`history`, `skip=${skip}${partner ? `&partner=${partner}` : ''}${token ? `&token=${token}` : ''}`)
  }

  /**
   * Get Profile data
   */
  public getProfile(): Promise<IUser> {
    return this.get('user')
  }
  /**
   * Removes all listed items
   */
  public removeAll() {
    return this.get(`remove-all`)
  }
  /**
   *
   * @param ids Either array or one item_id that you want to remove from listing
   */
  public removeItems(
    ids: number | number[] | string | string[],
  ): Promise<{ success: boolean; count: number; removed: number[] }> {
    let removeId: any[] = typeof ids === 'object' ? ids : [ids]
    return this.get(`remove-items`, removeId.map((i) => `id=${i}`).join('&'))
  }
  public async post(url: string, body: any): Promise<any> {
    let { baseUrl, api, version } = this
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`
    return (await axios.post(newUrl, body)).data
  }

  public async get(url: string, token?: string): Promise<any> {
    let { baseUrl, api, version } = this
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`
    if (token) newUrl += `&${token}`
    try {
      return (await axios.get(newUrl)).data
    } catch (e) {
      throw e
    }
  }
}
