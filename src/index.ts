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
   * Buy item using name and send to specific tradelink - `buy-one-p2p-name`
   *
   * @param name Market hash name of the item
   * @param price Price, should be greater than item price
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   * @param project_id Your custom id string[50]
   * @exmaple
   * // example response:
   * {
   *   "success": true,
   *   "id": 1,
   *   "msg": "buy_csgo"
   * }
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
   * Buy item using `item_id` and send to specific tradelink - `/buy-one-p2p`
   *
   * @param item_id Item id from fetching items
   * @param price Price of the item 1$=1000
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   * @param project_id Your custom id string[50]
   * @exmaple
   * // example resonse:
   * {
   *   "success": true,
   *   "id": 1,
   *   "msg": "buy_csgo"
   * }
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
   * Check many steam trades - `/check-many-steam`
   *
   * @param ids Ids or id that you recived when purchasing items
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "trades": [
   *     {
   *       "price": 1,
   *       "reason": "We couldn't validate your trade link, either your inventory is private or you can't trade",
   *       "trade_id": "3547735377",
   *       "for_steamid64": "76561198338314XXX",
   *       "id": 1,
   *       "name": "Nova | Sand Dune (Field-Tested)",
   *       "status": 6,
   *       "done": true,
   *       "send_until": 1566796475,
   *       "last_updated": 1566796131,
   *       "counter": 0
   *     }
   *   ]
   * }
   */
  public tradeRequestStatus(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = []
    if (typeof ids !== 'object') id = [ids]
    else id = [...ids]
    return this.get('check-many-steam', id.map((i) => `id=${i}`).join('&'))
  }

  /**
   * Check many steam trades - `check-many-project-id
   *
   * @param ids Ids or id that you passed as project_id when making a purchase
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "trades": [
   *     {
   *       "price": 1,
   *       "reason": "We couldn't validate your trade link, either your inventory is private or you can't trade",
   *       "trade_id": "3547735377",
   *       "for_steamid64": "76561198338314XXX",
   *       "id": 1,
   *       "name": "Nova | Sand Dune (Field-Tested)",
   *       "status": 6,
   *       "done": true,
   *       "send_until": 1566796475,
   *       "last_updated": 1566796131,
   *       "counter": 0
   *     }
   *   ]
   * }
   */
  public customTradeRequest(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = []
    if (typeof ids !== 'object') id = [ids]
    else id = [...ids]
    return this.get('check-many-project-id', id.map((i) => `id=${i}`).join('&'))
  }

  /**
   * Connect steam api and waxpeer api - `/set-my-steamapi`
   *
   * @param steam_api (optional) you can pass a steam api to waxpeer
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "string"
   * }
   */
  public setMyKeys(steam_api: string): Promise<ISetMyKeys> {
    return this.get('set-my-steamapi', `steam_api=${steam_api}&api=${this.api}`)
  }

  /**
   * Fetches items based on the game you pass as a query - `/get-items-list`
   *
   * @param skip How many items you want to skip
   * @param limit How many items you want to fetch (max 100)
   * @param game Game (csgo,dota2,vgo and etc check https://api.waxpeer.com/docs/#/Steam/get_get_items_list)
   * @param min_price Min price 1$=1000
   * @param max_price Max price
   * @param sort The order in which items are returned in (profit, desc, asc, best_deals)
   * @param minified If you pass this you will recieve additional info like float. Available values : 1, 2
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "AWP | Golden Illusion (Battle-Scarred)",
   *       "price": 6152,
   *       "selling": true,
   *       "image": "https://files.opskins.media/file/vgo-img/item/awp-golden-illusion-battle-scarred-300.png",
   *       "item_id": "11626252"
   *     }
   *   ]
   * }
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
   * Fetches your steam inventory make sure your steamid is connected on waxpeer - `/fetch-my-inventory`.
   * Call this endpoint before calling {@link getMyInventory|getMyInventory()} (`/get-my-inventory`)
   *
   * @example
   * // example response:
   * {
   *   "success": false,
   *   "msg": "Inventory is closed"
   * }
   */
  public fetchInventory(): Promise<FetchInventory> {
    return this.get('fetch-my-inventory')
  }

  /**
   * Fetch steam average price and other steam related info about all items - `/get-steam-items`
   *
   * @param game
   */
  public getSteamItems(game: string = 'csgo'): Promise<{ success: boolean; items: ISteamInfoItem[] }> {
    let gameId = game === 'csgo' ? 730 : 570
    return this.get('get-steam-items', `game=${gameId}`)
  }

  /**
   * Get min price, name, max_price, average price for all items - `/prices`
   *
   * @param game Game csgo,dota2,gc
   * @param min_price Min price
   * @param max_price Max price
   * @param search search
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "★ Karambit | Doppler (Minimal Wear)",
   *       "max": "820000",
   *       "count": "3",
   *       "avg": "773333",
   *       "min": "700000"
   *     }
   *   ]
   * }
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
   * It will validate tradelink and also cache it on waxpeer side so your purchase will be made instantly - `/check-tradelink`
   *
   * @param tradelink Full tradelink that you want to validate
   */
  public validateTradeLink(tradelink: string): Promise<ICheckLink> {
    return this.post(`check-tradelink`, { tradelink })
  }

  /**
   * Check weather items are available by item_id max 50 items - `/check-availability`
   *
   * @param item_id ItemIds that you want to check weather items are available
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "name": "AWP | Golden Illusion (Battle-Scarred)",
   *       "price": 6152,
   *       "selling": true,
   *       "image": "https://files.opskins.media/file/vgo-img/item/awp-golden-illusion-battle-scarred-300.png",
   *       "item_id": "11626252"
   *     }
   *   ]
   * }
   */
  public checkItemAvailability(
    item_id: string | number | string[] | number[],
  ): Promise<{ success: boolean; data: IAvailable[] }> {
    let ids = typeof item_id === 'object' ? item_id : [item_id]
    return this.get(`check-availability`, ids.map((i) => `item_id=${i}`).join('&'))
  }

  /**
   * Edit multiple items or set price to 0 to remove - `/edit-items`
   *
   * @param items Array of items with item_id and price keys
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "updated": [
   *     {
   *       "item_id": "141414144",
   *       "price": "1000"
   *     }
   *   ],
   *   "failed": [
   *     {
   *       "item_id": 141414144,
   *       "msg": "invalid price"
   *     }
   *   ],
   *   "removed": 0
   * }
   */
  public editItems(items: IEditItemsReq[]): Promise<IResponseEdit> {
    return this.post(`edit-items`, {
      items,
    })
  }

  /**
   * List steam items from inventory - `/list-items-steam`
   *
   * @param items Items object  https://api.waxpeer.com/docs/#/Steam/post_list_items_steam
   * @example
   * // example value:
   * {
   *   "success": true,
   *   "msg": "item_not_in_inventory",
   *   "listed": [
   *     {
   *       "item_id": 141414144,
   *       "price": 1000,
   *       "name": "AWP | Asiimov (Field-tested)"
   *     }
   *   ]
   * }
   */
  public listItemsSteam(items: ListedItem[]): Promise<ListItems> {
    return this.post('list-items-steam', {
      items,
    })
  }

  /**
   * Get listed steam items - `/list-items-steam`
   *
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "item_id": "16037911576",
   *       "price": 1000,
   *       "date": "2020-01-11T07:18:50.749Z",
   *       "position": 5,
   *       "name": "M4A1-S | Nitro (Factory New)",
   *       "steam_price": {
   *         "average": 30,
   *         "current": 28,
   *         "img": "-9a81dlWLwJ2UU..."
   *       }
   *     }
   *   ]
   * }
   */
  public myListedItems(game: string = 'csgo'): Promise<{ success: boolean; items: IListedItem[] }> {
    return this.get('list-items-steam', `game=${game ? game : 'csgo'}`)
  }

  /**
   * Get items that you can list for sale - `/get-my-inventory`
   *
   * @param skip Skip items
   * @param game Game
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "item_id": "16037911576",
   *       "color": "D2D2D2",
   *       "type": "Sniper Rifle",
   *       "name": "AWP | Asiimov",
   *       "steam_price": {
   *         "average": 30,
   *         "current": 28,
   *         "img": "-9a81dlWLwJ2UU..."
   *       }
   *     }
   *   ],
   *   "count": 0,
   *   "msg": "noSteamid"
   * }
   */
  public getMyInventory(skip: number = 0, game: string = 'csgo'): Promise<GetMySteamInv> {
    let gameId = game === 'csgo' ? 730 : game === 'dota2' ? 570 : 440
    return this.get('get-my-inventory', `game=${gameId}&skip=${skip}`)
  }

  /**
   * Search multiple items by name - `/search-items-by-name`
   *
   * @param names Array of item names
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "AWP | Golden Illusion (Battle-Scarred)",
   *       "price": 6152,
   *       "selling": true,
   *       "image": "https://files.opskins.media/file/vgo-img/item/awp-golden-illusion-battle-scarred-300.png",
   *       "item_id": "11626252"
   *     }
   *   ]
   * }
   */
  public searchItems(names: string[] | string): Promise<GetItems> {
    let nameSearch = typeof names === 'object' ? names : [names]
    let searchNames = nameSearch.map((i) => `names=${encodeURIComponent(i)}`).join('&')
    return this.get('search-items-by-name', searchNames)
  }

  /**
   * Get recent purchases - `/history`
   *
   * @param skip skip since by default it returns 50 items
   * @param partner partner parameter that you passed when buying
   * @param token token parameter that you passed when buying
   * @example
   * // example response
   * {
   *   "success": true,
   *   "history": [
   *     {
   *       "item_id": "string",
   *       "trade_id": 0,
   *       "token": "string",
   *       "partner": 0,
   *       "created": "2020-01-18T07:28:12.360Z",
   *       "send_until": "2020-01-18T07:28:12.360Z",
   *       "reason": "Seller failed to accept",
   *       "id": 0,
   *       "image": "string",
   *       "price": 0,
   *       "name": "string",
   *       "status": 0
   *     }
   *   ]
   * }
   */
  public myPurchases(skip = 0, partner?: string, token?: string): Promise<IBuyMyHistory> {
    return this.get(`history`, `skip=${skip}${partner ? `&partner=${partner}` : ''}${token ? `&token=${token}` : ''}`)
  }

  /**
   * Get Profile data - `/user`
   *
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "user": {
   *     "wallet": 1000,
   *     "id": "11d6f117-1ad2-47e1-aca1-bcasdf9e37fa",
   *     "userid": 1,
   *     "id64": "765611983383140000",
   *     "avatar": "https://www.gravatar.com/avatar/31609d41eb6ccb405b1984967693de76?d=identicon&r=pg&s=32",
   *     "name": "WAXPEER",
   *     "sell_fees": 0.95,
   *     "can_p2p": true,
   *     "tradelink": "https://steamcommunity.com/tradeoffer/new/?partner=378049039&token=XWpC4ZTT",
   *     "login": "makc",
   *     "ref": "waxpeer",
   *     "sell_status": true
   *   }
   * }
   */
  public getProfile(): Promise<IUser> {
    return this.get('user')
  }

  /**
   * Removes all listed items - `/remove-all`
   *
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "string",
   *   "count": 0
   * }
   */
  public removeAll() {
    return this.get(`remove-all`)
  }
  /**
   * Remove specified items - `/remove-items`
   *
   * @param ids Either array or one item_id that you want to remove from listing
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "count": 1
   * }
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
