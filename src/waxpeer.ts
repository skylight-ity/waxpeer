import axios from 'axios';
import qs from 'qs';
const RateLimiter = require('limiter').RateLimiter;

export class Waxpeer {
  private api: string;
  public baseUrl = 'https://api.waxpeer.com';
  public version = 'v1';
  private getPricesLimiter = new RateLimiter({ tokensPerInterval: 60, interval: 60 * 1000 }); //Ignoring this limit might cause 429 error code or IP ban
  private getPricesDopplersLimiter = new RateLimiter({ tokensPerInterval: 60, interval: 60 * 1000 }); //Ignoring this limit might cause 429 error code or IP ban
  constructor(api: string, baseUrl?: string) {
    this.api = api;
    if (baseUrl) this.baseUrl = baseUrl;
  }
  public async sleep(timer: number) {
    await new Promise((res) => setTimeout(res, timer));
  }

  /**
   * Fetch trades and transactions by one request, maximum 100 in response.
   *
   * @param skip Skip to get next results (max 1000)
   * @param start Start date
   * @param end End date
   * @param sort (optional) Sort by creation time
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "data": {
   *     "trades": [
   *       {
   *         "date": "2022-10-29T23:58:17.318Z",
   *         "created": "2022-10-29T23:52:17.318Z",
   *         "id": 4258120,
   *         "item_id": "27341302961",
   *         "give_amount": 22,
   *         "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/4839650857/200fx125f",
   *         "price": 24,
   *         "game": "csgo",
   *         "name": "Sticker | BIG | Antwerp 2022",
   *         "status": 5,
   *         "average": 30,
   *         "action": "buy"
   *       }
   *     ],
   *     "transactions": [
   *       {
   *         "wallet": "string",
   *         "type": "BTC",
   *         "status": "completed",
   *         "amount": "10256672",
   *         "give_amount": "10256672",
   *         "direction": "in",
   *         "date": "2022-01-22T01:22:43.021Z"
   *       }
   *     ]
   *   }
   * }
   */
  public myHistory(skip: number, start: string, end: string, sort: 'ASC' | 'DESC' = 'DESC'): Promise<IMyHistory> {
    return this.post('my-history', { skip, start, end, sort });
  }

  /**
   * Change your tradelink - `/change-tradelink`
   * @param tradelink Your new tradelink
   * @example
   * // example response:
   * /{
   * /  "success": false,
   * /  "link": "https://steamcommunity.com/tradeoffer/new/?partner=900267897&token=P2YkRJOk",
   * /  "info": "You cannot trade with SteamUserName because they have a trade ban.",
   * /  "msg": "We couldn't validate your trade link, either your inventory is private or you can't trade",
   * /  "token": "P2YkRJOk",
   * /  "steamid32": 900267897,
   * /  "steamid64": 76561198000000000
   * /}
   */
  public changeTradeLink(tradelink: string): Promise<ICheckTradeLink> {
    return this.post('change-tradelink', { tradelink });
  }

  /**
   * Buy item using name and send to specific tradelink - `buy-one-p2p-name`
   *
   * Notes about trades and frequently asked questions.
   * The duration of the trade in different situations:
   * If seller's info is invalid then it can be cancelled immediately and status 6 is set;
   * If seller's details are valid, but no trade is created, then it will auto-cancel after 6 minutes;
   * if created or waiting for mobile confirmation then it will auto-cancel after 11 to 15 min (depends on when created);
   * if trade is waiting for mobile confirmation and connection with the seller was lost then it will auto-cancel after 6 hours.
   * We recommend adding project_id to purchase so that you can track a trade in case of a timeout or break of purchase request using the /check-many-project-id GET method one minute after the request.
   * An array of possible messages with purchase errors and other information, such as status, can be seen by opening the response scheme, where:
   * System busy - trade is cancelled due to tradelink check timeout or heavy load;
   * buy_csgo - CS:GO purchases are deactivated on the market;
   * buy_rust - RUST purchases are deactivated on the market.
   *
   * @param name Market hash name of the item
   * @param price Price, should be greater than item price
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   * @param project_id Your custom id string[50]
   * @param game Game from supported games
   * @example
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
    project_id: string = undefined,
    game: keyof typeof EGameId = 'csgo',
  ): Promise<IBuy> {
    return this.get(
      'buy-one-p2p-name',
      qs.stringify({ name: encodeURIComponent(name), price, token, partner, project_id, game }),
    );
  }

  /**
   * Buy item using `item_id` and send to specific tradelink - `/buy-one-p2p`
   *
   * WARNING: Always paste item_id as string for RUST items.
   * Notes about trades and frequently asked questions.
   * The duration of the trade in different situations:
   * If seller's info is invalid then it can be cancelled immediately and status 6 is set;
   * If seller's details are valid, but no trade is created, then it will auto-cancel after 6 minutes;
   * if created or waiting for mobile confirmation then it will auto-cancel after 11 to 15 min (depends on when created);
   * if trade is waiting for mobile confirmation and connection with the seller was lost then it will auto-cancel after 6 hours.
   * We recommend adding project_id to purchase so that you can track a trade in case of a timeout or break of purchase request using the /check-many-project-id GET method one minute after the request.
   * An array of possible messages with purchase errors and other information, such as status, can be seen by opening the response scheme, where:
   * System busy - trade is cancelled due to tradelink check timeout or heavy load;
   * buy_csgo - CS:GO purchases are deactivated on the market;
   * buy_rust - RUST purchases are deactivated on the market.
   *
   * @param item_id Item id from fetching items
   * @param price Price of the item 1$=1000
   * @param token Token from tradelink
   * @param partner Partner from tradelink
   * @param project_id Your custom id string[50]
   * @example
   * // example resonse:
   * {
   *   "success": true,
   *   "id": 1,
   *   "msg": "buy_csgo"
   * }
   */
  public buyItemWithId(
    item_id: string | number,
    price: number,
    token: string,
    partner: string,
    project_id?: string,
  ): Promise<IBuy> {
    return this.get('buy-one-p2p', qs.stringify({ item_id, price, token, partner, project_id }));
  }

  /**
   * Get recent purchases by filters - `/history`
   *
   * @param partner (optional) Partner from tradelink
   * @param token (optional) Token from tradelink
   * @param skip (optional) How many items to skip
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "history": [
   *     {
   *       "item_id": "27165625733",
   *       "trade_id": 5114261104,
   *       "token": "ssR242yo",
   *       "partner": 153912146,
   *       "created": "2020-01-18T07:28:12.360Z",
   *       "send_until": "2020-01-18T07:28:12.360Z",
   *       "reason": "Buyer failed to accept",
   *       "id": 4258189,
   *       "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/5040342865/200fx125f",
   *       "price": 1200,
   *       "name": "USP-S | Cortex (Field-Tested)",
   *       "status": 6
   *     }
   *   ]
   * }
   */
  public getHistory(partner?: string, token?: string, skip?: number): Promise<IHistory> {
    return this.get('history', qs.stringify({ partner, token, skip }));
  }

  /**
   * Checking the status of many steam trades by project_id identifier - `/check-many-steam`
   *
   * Please check success state. Success must be "true" and msg usually null, but if something went wrong, you will get error message here and you need to retry the request.
   *
   * @param ids Ids or id that you recived when purchasing items
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "Invalid ID",
   *   "trades": [
   *     {
   *       "id": 1,
   *       "price": 140,
   *       "name": "Nova | Sand Dune (Field-Tested)",
   *       "status": 4,
   *       "project_id": "My_custom_project_identifier_asgd6ad8sg68gasgas8d",
   *       "custom_id": "224bdce2-as44-5ae6-be3g-1a80500de23s",
   *       "trade_id": "3547735377",
   *       "done": false,
   *       "for_steamid64": "76561198338314XXX",
   *       "reason": "We couldn't validate your trade link, either your inventory is private or you can't trade",
   *       "seller_name": "turboTrade",
   *       "seller_avatar": "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
   *       "seller_steam_joined": 1589314982,
   *       "seller_steam_level": 45,
   *       "send_until": 1566796475,
   *       "last_updated": 1566796111,
   *       "counter": 10
   *     }
   *   ]
   * }
   */
  public tradeRequestStatus(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = [];
    if (typeof ids !== 'object') id = [ids];
    else id = [...ids];
    return this.get('check-many-steam', id.map((i) => `id=${i}`).join('&'));
  }

  /**
   * Check many steam trades - `check-many-project-id
   *
   * Please check success state. Success must be "true" and msg usually null, but if something went wrong, you will get error message here and you need to retry the request.
   *
   * @param ids Ids or id that you passed as project_id when making a purchase
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "Please try again",
   *   "trades": [
   *     {
   *       "id": 1,
   *       "price": 140,
   *       "name": "Nova | Sand Dune (Field-Tested)",
   *       "status": 4,
   *       "project_id": "My_custom_project_identifier_asgd6ad8sg68gasgas8d",
   *       "custom_id": "224bdce2-as44-5ae6-be3g-1a80500de23s",
   *       "trade_id": "3547735377",
   *       "done": false,
   *       "for_steamid64": "76561198338314XXX",
   *       "reason": "We couldn't validate your trade link, either your inventory is private or you can't trade",
   *       "seller_name": "turboTrade",
   *       "seller_avatar": "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
   *       "seller_steam_joined": 1589314982,
   *       "seller_steam_level": 45,
   *       "send_until": 1566796475,
   *       "last_updated": 1566796111,
   *       "counter": 10
   *     }
   *   ]
   * }
   */
  public customTradeRequest(ids: number | number[] | string | string[]): Promise<TradesStatus> {
    let id = [];
    if (typeof ids !== 'object') id = [ids];
    else id = [...ids];
    return this.get('check-many-project-id', id.map((i) => `id=${i}`).join('&'));
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
    return this.get('set-my-steamapi', qs.stringify({ steam_api }));
  }

  /**
   * Fetches your steam inventory make sure your steamid is connected on waxpeer - `/fetch-my-inventory`.
   * Call this endpoint before calling {@link getMyInventory|getMyInventory()} (`/get-my-inventory`)
   *
   * @param game Game from supported games
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "total_inventory_count": 120
   * }
   */
  public fetchInventory(game: keyof typeof EGameId = 'csgo'): Promise<FetchInventory> {
    return this.get('fetch-my-inventory', qs.stringify({ game }));
  }

  /**
   * Fetch all unique items and their min price and count - `/prices`
   *
   * @param game Game from supported games
   * @param min_price (optional) Min price
   * @param max_price (optional) Max price
   * @param search (optional) Search by part of the name, ex: 'hardened'.
   * @param minified (optional) Will return additional data about items if set to 0
   * @param highest_offer (optional) Will return highest_offer for the items if set to 1
   * @param single (optional) Will select only one item if set to 1
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "★ Hand Wraps | Cobalt Skulls (Minimal Wear)",
   *       "count": 5,
   *       "min": 937999,
   *       "img": "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DfVlxgLQFFibKkJQN3wfLYYgJK7dKyg5KKh8j4NrrFnm5D8fp3i-vT_I_KilihriwvOCyveMX6Ll9pORy_pgD8lrvxgJfpvpWamnZn6XUl5SmJm0DjhhlFbedp1PWYH1jNVaUcSqOKBnuCtYczFntLO18msw",
   *       "steam_price": "990000",
   *       "rarity_color": "#EB4B4B",
   *       "type": "Gloves"
   *     }
   *   ]
   * }
   */
  public getPrices(
    game: keyof typeof EGameId = 'csgo',
    min_price: number = undefined,
    max_price: number = undefined,
    search: string = undefined,
    minified: 0 | 1 = 1,
    highest_offer: number = 0,
    single: 0 | 1 = 0,
  ): Promise<IPrices> {
    if (!this.getPricesLimiter.tryRemoveTokens(1))
      return Promise.reject(new Error('Too many requests, try again later'));
    return this.get(
      `prices`,
      qs.stringify({
        game,
        min_price,
        max_price,
        search: typeof search === 'string' && search?.length ? encodeURIComponent(search) : undefined,
        minified,
        highest_offer,
        single,
      }),
    );
  }

  /**
   * Fetch all dopplers phases by filters - `/prices/dopplers`
   *
   * @param phase (optional) Doppler phase. Will return all if set to 'any'. For multiple phases pass it like this phase=Emerald&phase=Ruby
   * @param exterior (optional) Item exterior. Will return all if not set. For multiple exteriors pass it like this exterior=FN&exterior=MW
   * @param weapon (optional) Weapon type. Will return all if not set. For multiple weapons pass it like this weapon=Bayonet&weapon=Karambit
   * @param minified (optional) Will return additional data about items if set to 0 (steam_price, img, weapon, float, paint_index)
   * @param min_price (optional) Min price
   * @param max_price (optional) Max price
   * @param search (optional) Search by part of the name, ex: 'bayonet'.
   * @param single (optional) Will select only one item if set to 1
   * @example
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "★ Butterfly Knife | Doppler (Factory New)",
   *       "item_id": "27253164358",
   *       "price": 1380000,
   *       "phase": "Phase 3",
   *       "steam_price": 1453040,
   *       "img": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/5070448210/200fx125f",
   *       "weapon": "Butterfly Knife",
   *       "paint_index": 420,
   *       "float": 0.0460052728652954
   *     }
   *   ],
   *   "msg": "Wrong input"
   * }
   */
  public getPricesDopplers(
    phase: keyof typeof EDopplersPhases = 'any',
    exterior: keyof typeof EMinExteriors = undefined,
    weapon: keyof typeof EWeapon = undefined,
    minified: 0 | 1 = 1,
    min_price: number = undefined,
    max_price: number = undefined,
    search: string = undefined,
    single: 0 | 1 = 0,
  ): Promise<IPricesDopplers> {
    if (!this.getPricesDopplersLimiter.tryRemoveTokens(1))
      return Promise.reject(new Error('Too many requests, try again later'));
    return this.get(
      `prices/dopplers`,
      qs.stringify({ phase, exterior, weapon, minified, min_price, max_price, search, single }),
    );
  }

  /**
   * Fetch all listings by names. The maximum names per request is 50
   * For csgo dopplers items 'phase' parameter available in response. Possible values: 'Emerald', 'Ruby', 'Sapphire', 'Black Pearl', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'
   * @param game (optional) Game from supported games
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "data": {
   *     "AK-47 | Redline (Field-Tested)": {
   *       "listings": [
   *         [
   *           {
   *             "price": 12100,
   *             "by": "1247ffd5-f437-4a30-9953-10eda7df6e17",
   *             "item_id": "27165625733",
   *             "name": "AK-47 | Redline (Field-Tested)",
   *             "paint_index": 123,
   *             "steam_price": 14100,
   *             "classid": "3669724953",
   *             "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/3669724953"
   *           }
   *         ]
   *       ],
   *       "orders": [
   *         {}
   *       ],
   *       "history": [
   *         {}
   *       ],
   *       "info": {}
   *     },
   *     "★ Butterfly Knife | Gamma Doppler (Factory New)": {
   *       "listings": [
   *         [
   *           {
   *             "price": 2050000,
   *             "by": "1247ffd5-f437-4a30-9953-10eda7df6e17",
   *             "item_id": "27165625734",
   *             "name": "★ Butterfly Knife | Gamma Doppler (Factory New)",
   *             "paint_index": 572,
   *             "steam_price": 1709860,
   *             "classid": "5035516602",
   *             "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/5035516602",
   *             "phase": "Phase 4"
   *           }
   *         ]
   *       ],
   *       "orders": [
   *         {}
   *       ],
   *       "history": [
   *         {}
   *       ],
   *       "info": {}
   *     }
   *   }
   * }
   */
  public massInfo(names: string[], game: keyof typeof EGameId = 'csgo'): Promise<IMassInfo> {
    return this.post('mass-info', { name: names, sell: 1 }, qs.stringify({ game }));
  }

  /**
   * Check provided tradelink - `/check-tradelink`
   * @param tradelink Target tradelink
   * @example
   * // example response:
   * /{
   * /  "success": false,
   * /  "link": "https://steamcommunity.com/tradeoffer/new/?partner=900267897&token=P2YkRJOk",
   * /  "info": "You cannot trade with SteamUserName because they have a trade ban.",
   * /  "msg": "We couldn't validate your trade link, either your inventory is private or you can't trade",
   * /  "token": "P2YkRJOk",
   * /  "steamid32": 900267897,
   * /  "steamid64": 76561198000000000
   * /}
   */
  public validateTradeLink(tradelink: string): Promise<ICheckTradeLink> {
    return this.post(`check-tradelink`, { tradelink });
  }

  /**
   * Check weather items are available by item_id max 100 items - `/check-availability`
   *
   * @param item_id ItemIds that you want to check weather items are available
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "item_id": "27165625733",
   *       "selling": true,
   *       "price": 1687470,
   *       "name": "★ Karambit | Fade (Factory New)",
   *       "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/310854699/200fx125f"
   *     }
   *   ]
   * }
   */
  public checkItemAvailability(
    item_id: string | number | string[] | number[],
  ): Promise<{ success: boolean; data: IAvailable[] }> {
    let ids = typeof item_id === 'object' ? item_id : [item_id];
    return this.get(`check-availability`, ids.map((i) => `item_id=${i}`).join('&'));
  }

  /**
   * Edit price for listed items - `/edit-items`
   *
   * Array of items
   * Rate limit of list/edit actions for each item_id is 2 requests per 120 seconds
   * Note: For Rust items item_id must be a string type, since id is greater than the maximum for number type
   * Set the price to 0 to remove the item from sale
   * @param items Array of items with item_id and price keys
   * @param game (optional) Game from supported games
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
   *       "item_id": 141414145,
   *       "price": 1000,
   *       "msg": "You can update price after 40 seconds",
   *       "msBeforeNext": 39636
   *     }
   *   ],
   *   "removed": 0
   * }
   */
  public editItems(items: IEditItemsReq[], game: keyof typeof EGameId = 'csgo'): Promise<IResponseEdit> {
    return this.post(
      `edit-items`,
      {
        items,
      },
      qs.stringify({ game }),
    );
  }

  /**
   * List steam items from inventory - `/list-items-steam`
   *
   * @param items Items object  https://api.waxpeer.com/docs/#/Steam/post_list_items_steam
   * @param game (optional) Game from supported games
   * @example
   * // example value:
   * {
   *   "success": true,
   *   "msg": "no items",
   *   "listed": [
   *     {
   *       "item_id": 141414144,
   *       "price": 1000,
   *       "name": "AWP | Asiimov (Field-tested)"
   *     }
   *   ],
   *   "failed": [
   *     {
   *       "item_id": 141414145,
   *       "price": 1000,
   *       "msg": "You can list your item after 40 seconds",
   *       "msBeforeNext": 39636
   *     }
   *   ]
   * }
   */
  public listItemsSteam(items: ListedItem[], game: keyof typeof EGameId = 'csgo'): Promise<ListItems> {
    return this.post(
      'list-items-steam',
      {
        items,
      },
      qs.stringify({ game }),
    );
  }

  /**
   * Get listed steam items - `/list-items-steam`
   *
   * @param game (optional) Game from supported games
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "item_id": "16037911576",
   *       "price": 2367941,
   *       "date": "2020-01-11T07:18:50.749Z",
   *       "position": 1,
   *       "name": "★ Butterfly Knife | Gamma Doppler (Factory New)",
   *       "market_name": "Gamma Doppler Phase 2",
   *       "steam_price": {
   *         "average": 2767941,
   *         "rarity_color": "string",
   *         "rarity": "string",
   *         "current": 2633000,
   *         "name": "★ Butterfly Knife | Gamma Doppler Phase 2 (Factory New)",
   *         "lowest_price": 2125555,
   *         "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPD1PrbQqW9e-NV9j_v-5YT0m1HllB81NDG3S9rEMFFrf1iC_QXqw7u9h5PqupTKyiNh6ClxtCvczUPmgUtPPbE-1qDISFicAqVXXP7V9p_o84A"
   *       }
   *     }
   *   ]
   * }
   */
  public myListedItems(game: keyof typeof EGameId = 'csgo'): Promise<{ success: boolean; items: IListedItem[] }> {
    return this.get('list-items-steam', qs.stringify({ game }));
  }

  /**
   * Get items that you can list for sale - `/get-my-inventory`
   *
   * @param skip (optional) Skip items
   * @param game (optional) Game from supported games
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "item_id": "24758826121",
   *       "type": "Butterfly Knife",
   *       "icon_url": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPD1PrbQqW9e-NV9j_v-5YT0m1HmlB81NDG3OtOcdlM5MF3Srla4wO-8h5PuucyawHo37HZxsXePnEe20xseaLBnhPSACQLJc-o5FQc",
   *       "name": "★ Butterfly Knife | Gamma Doppler (Factory New)",
   *       "steam_price": {
   *         "average": 2767941,
   *         "rarity_color": "string",
   *         "rarity": "string",
   *         "current": 2633000,
   *         "name": "★ Butterfly Knife | Gamma Doppler Phase 2 (Factory New)",
   *         "lowest_price": 2125555,
   *         "img": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPD1PrbQqW9e-NV9j_v-5YT0m1HllB81NDG3S9rEMFFrf1iC_QXqw7u9h5PqupTKyiNh6ClxtCvczUPmgUtPPbE-1qDISFicAqVXXP7V9p_o84A"
   *       }
   *     }
   *   ],
   *   "count": 5,
   * }
   */
  public getMyInventory(skip: number = 0, game: keyof typeof EGameId = 'csgo'): Promise<GetMySteamInv> {
    return this.get('get-my-inventory', qs.stringify({ skip, game }));
  }

  /**
   * Search multiple items by name - `/search-items-by-name`
   *
   * @param names Array of item names
   * @param game (optional) Game from supported games
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "★ Butterfly Knife | Gamma Doppler (Factory New)",
   *       "price": 2050000,
   *       "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/5035516602",
   *       "item_id": "27165625734",
   *       "phase": "Phase 4"
   *     }
   *   ]
   * }
   */
  public searchItems(names: string[] | string, game: keyof typeof EGameId = 'csgo'): Promise<GetItems> {
    let nameSearch = typeof names === 'object' ? names : [names];
    let searchNames = nameSearch.map((i) => `names=${encodeURIComponent(i)}`).join('&');
    return this.get('search-items-by-name', `game=${game}&${searchNames}`);
  }

  /**
   * Get recent purchases - `/history`
   *
   * @param skip skip since by default it returns 50 items
   * @param partner (optional) partner parameter that you passed when buying
   * @param token (optional) token parameter that you passed when buying
   * @example
   * // example response
   * {
   *   "success": true,
   *   "history": [
   *     {
   *       "item_id": "27165625733",
   *       "trade_id": 5114261104,
   *       "token": "ssR242yo",
   *       "partner": 153912146,
   *       "created": "2020-01-18T07:28:12.360Z",
   *       "send_until": "2020-01-18T07:28:12.360Z",
   *       "reason": "Buyer failed to accept",
   *       "id": 4258189,
   *       "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/5040342865/200fx125f",
   *       "price": 1200,
   *       "name": "USP-S | Cortex (Field-Tested)",
   *       "status": 6
   *     }
   *   ]
   * }
   */
  public myPurchases(skip = 0, partner: string = undefined, token: string = undefined): Promise<IBuyMyHistory> {
    return this.get(`history`, qs.stringify({ skip, partner, token }));
  }

  /**
   * Fetch trades that need to be sent - `/ready-to-transfer-p2p`
   *
   * Connecting to the trade websocket is required to sell items (included in the extension and official app).
   * If your connection is unstable (such as public Wi-Fi or mobile data), your trade websocket connection can be interrupted and the creation of a trade event may be missed.
   * In order not to miss the sending of a trade you should be making this request at least every minute.
   * Please check send_until timestamp before creating trade in Steam (we do not recommend creating a trade if one minute or less is left).
   * Trade websocket documentation is published here (https://docs.waxpeer.com/?method=websocket).
   *
   * @param steam_api Steam API key
   * @example
   * // example response
   * {
   *   "id": 1,
   *   "costum_id": "string",
   *   "trade_id": "3547735377",
   *   "tradelink": "https://steamcommunity.com/tradeoffer/new/?partner=14221897&token=i2yUssgF",
   *   "trade_message": "string",
   *   "done": false,
   *   "stage": 1,
   *   "creator": "seller",
   *   "send_until": "2022-10-30T15:18:46.566Z",
   *   "last_updated": "2022-10-30T15:13:08.139Z",
   *   "for_steamid64": "76561198338314XXX",
   *   "user": {
   *     "id": "182dbd1c-2es6-470s-z1q2-627xa6207211",
   *     "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/16/1622081f90ef78b0ca1372cae7663a2592939e00_medium.jpg"
   *   },
   *   "seller": {
   *     "id": "282dbd1c-2es6-470s-z1q2-627xa6207212",
   *     "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/16/1622081f90ef78b0ca1372cae7663a2592939e00_medium.jpg"
   *   },
   *   "items": [
   *     {
   *       "id": 4258189,
   *       "item_id": "27165625733",
   *       "give_amount": 25926,
   *       "merchant": "string",
   *       "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/5041964706/200fx125f",
   *       "price": 27581,
   *       "game": "csgo",
   *       "name": "AWP | Neo-Noir (Minimal Wear)",
   *       "status": 0
   *     }
   *   ]
   * }
   */
  public readyToTransferP2P(steam_api: string): Promise<IReadyTransferTrade> {
    return this.get(`ready-to-transfer-p2p`, qs.stringify({ steam_api }));
  }

  /**
   * Force p2p status check. Recommended for usage with poor network connections - `/check-wss-user`
   *
   * If the network connection is poor, we recommend to request once per hour so that items remain or come back on sale.
   * Note: This method will enable items for sale if you're connected to the trade websocket and even if you set your sales status to offline.
   * @param steamid Your Steam64ID. Can be found in /user endpoint
   * @example
   * // example response
   * {
   *   "success": true,
   *   "step": 3,
   *   "msg": "You can sell now"
   * }
   */
  public checkWssUser(steamid: string): Promise<ICheckWssUser> {
    return this.get(`check-wss-user`, qs.stringify({ steamid }));
  }

  /**
   * Get Profile data - `/user`
   *
   * @example
   * // example response:
   * {
   *  "success": true,
   *  "user": {
   *  "wallet": 1000,
   *  "id": "11d6f117-1ad2-47e1-aca1-bcasdf9e37fa",
   *  "userid": 1,
   *  "id64": "765611983383140000",
   *  "avatar": "https://www.gravatar.com/avatar/31609d41eb6ccb405b1984967693de76?d=identicon&r=pg&s=32",
   *  "name": "WAXPEER",
   *  "sell_fees": 0.95,
   *  "can_p2p": true,
   *  "tradelink": "https://steamcommunity.com/tradeoffer/new/?partner=378049039&token=XWpC4ZTT",
   *  "login": "makc",
   *  "ref": "waxpeer",
   *  "sell_status": true
   *  }
   * }
   */
  public getProfile(): Promise<IUser> {
    return this.get('user');
  }

  /**
   * Create a new user and obtain a unique API key or get an API key from an already created account without Steam OAuth - `/v1/user`
   * Both accounts must be unrestricted on Waxpeer.
   * Target account must be new on Waxpeer or have no active 2fa and enabled the collection of account information (You can enable it on the site if it is turned off).
   * The token will not be used as a cookie in Steam during the API key creation/get process.
   * @param api Your WAXPEER API of creator account
   * @param token Your Steam access token from the target account. Token should be in base64 format and belong to your target account.
   * @example
   * // example response:
   * {
   *  "success": boolean,
   *  "data": {
   *    "api": "string",
   *    "isNew": "boolean",
   *  },
   *  "msg": "string",
   *  "exp": number
   * }
   *
   */
  public createUser(token: string): Promise<CreateUser> {
    return this.post(`user`, { token });
  }

  /**
   * Removes all listed items - `/remove-all`
   *
   * @param game (optional) Game from supported games (If not passed - will remove for all games)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "string",
   *   "count": 0
   * }
   */
  public removeAll(game: keyof typeof EGameId = undefined): Promise<IRemoveAll> {
    return this.get(`remove-all`, qs.stringify({ game }));
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
    let removeId: any[] = typeof ids === 'object' ? ids : [ids];
    return this.get(`remove-items`, removeId.map((i) => `id=${i}`).join('&'));
  }

  /**
   * Buy order trigger history - `/buy-order-history`
   *
   * @param skip (optional) How many orders to skip
   * @param game (optional) Game from supported games (without game param will return for all)
   * @param sort (optional) Sort by date (default: ASC)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "history": [
   *     {
   *       "id": 0,
   *       "item_name": "string",
   *       "game": "string",
   *       "price": 0,
   *       "created": "2020-03-25T07:10:03.674Z",
   *       "last_updated": "2020-03-25T07:10:03.674Z"
   *     }
   *   ],
   *   "count": 2
   * }
   */
  public buyOrderHistory(
    skip: number = 0,
    game?: keyof typeof EGameId,
    sort: 'ASC' | 'DESC' = 'ASC',
  ): Promise<IBuyOrderHistory> {
    return this.get(`buy-order-history`, qs.stringify({ skip, game, sort }));
  }

  /**
   * Active buy orders. Sorted by price DESC, if a filter by name is specified - `/buy-orders`
   *
   * @param skip (optional) How many orders to skip
   * @param name (optional) Filter by item name
   * @param own (optional) Filter by own orders
   * @param game (optional) Game from supported games (without game param will return for all)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "offers": [
   *     {
   *       "id": 1,
   *       "name": "MP9 | Hypnotic (Minimal Wear)",
   *       "price": 1,
   *       "amount": 5,
   *       "game": "csgo",
   *       "filled": 2,
   *       "by": "1247ffd5-f437-4a30-9953-10eda7df6e17"
   *     }
   *   ],
   *   "count": 0
   * }
   */
  public buyOrders(
    skip: number = 0,
    name?: string,
    own: '0' | '1' = '0',
    game?: keyof typeof EGameId,
  ): Promise<IBuyOrders> {
    return this.get(`buy-orders`, qs.stringify({ skip, name, own, game }));
  }

  /**
   * Create a buy order to auto purchase items. Currently independent of the p2p status of the user - `/create-buy-order`
   *
   * @param name Item name
   * @param amount Amount of items to buy
   * @param price Max price that you want to buy item for (1000 = 1$)
   * @param game Game from supported games
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "Placed order",
   *   "filled": 2,
   *   "id": 2007
   * }
   */
  public createBuyOrder(
    name: string,
    amount: number,
    price: number,
    game: keyof typeof EGameId = 'csgo',
  ): Promise<ICreateBuyOrder> {
    return this.post(`create-buy-order`, null, qs.stringify({ name, amount, price, game }));
  }

  /**
   * Edit buy order - `/edit-buy-order`
   *
   * @param id Order id
   * @param amount Amount of items to buy
   * @param price Max price that you want to buy item for (1000 = 1$)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "string",
   *   "id": 2007,
   *   "amount": 6,
   *   "price": 2008
   * }
   */
  public editBuyOrder(id: number, amount: number, price: number): Promise<IEditBuyOrder> {
    return this.post(`edit-buy-order`, { id, amount, price });
  }

  /**
   * Remove buy order(s) - `/remove-buy-order`
   *
   * @param ids Either array or one order_id that you want to remove from listing
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "string",
   *   "removed": 5
   * }
   */
  public removeBuyOrder(ids: number | number[]): Promise<IRemoveBuyOrder> {
    let removeIds: any[] = typeof ids === 'object' ? ids : [ids];
    return this.get(`remove-buy-order`, removeIds.map((i) => `id=${i}`).join('&'));
  }

  /**
   * Remove all buy orders by filters - `/remove-all-orders`
   *
   * Remove all orders with filter by game.
   * Note: If response success is false, then some orders may be not removed (due to timeout), removed count will be also available in that case
   *
   * @param game (optional) Game from supported games (without game param will remove all)
   */
  public removeAllOrders(game: keyof typeof EGameId = undefined): Promise<IRemoveAllOrders> {
    return this.get(`remove-all-orders`, qs.stringify({ game }));
  }

  /**
   * Fetches items based on the game you pass as a query - `/get-items-list`
   *
   * Responses are limited to 100 items.
   *
   * @param skip (optional) How many items to skip
   * @param search (optional) Search by item name
   * @param brand (optional) The specified category of game items, ex: rifle for CS:GO and Pants for Rust
   * @param order (optional) Order by ASC or DESC (default DESC)
   * @param order_by (optional) Return order
   * @param exterior (optional) Exterior of the item (for CS:GO game)
   * @param max_price (optional) Max price of the item (1000 = 1$)
   * @param min_price (optional) Min price of the item (1000 = 1$)
   * @param game Game from supported games (default csgo)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "★ Butterfly Knife | Gamma Doppler (Factory New)",
   *       "price": 4999,
   *       "float": 0.1452850103378296,
   *       "best_deals": 541,
   *       "discount": 10,
   *       "steam_price": 5540,
   *       "image": "https://steamcommunity-a.akamaihd.net/economy/image/class/730/520026599/200fx125f",
   *       "item_id": "27402864642",
   *       "brand": "pistol",
   *       "type": "Glock-18"
   *     }
   *   ],
   *   "count": 100
   * }
   */
  public getItemsList(
    skip: number = 0,
    search: string = undefined,
    brand: keyof typeof EWeaponBrand = undefined,
    order: 'ASC' | 'DESC' = 'DESC',
    order_by: 'price' | 'name' | 'discount' | 'best_deals' = 'price',
    exterior: keyof typeof EMinExteriors = undefined,
    max_price: number = undefined,
    min_price: number = undefined,
    game: keyof typeof EGameId = 'csgo',
  ): Promise<IGetItemsList> {
    return this.get(
      `get-items-list`,
      qs.stringify({
        skip,
        search,
        brand,
        order,
        order_by,
        exterior,
        max_price,
        min_price,
        game,
      }),
    );
  }

  /**
   * Fetches recommended item price and other info - `/get-steam-items`
   *
   * @param game Game app_id from supported games (default 730)
   * @param highest_offer (optional) Highest offer price (Not accurate, because not filtering offers by users balances)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "items": [
   *     {
   *       "name": "AK-47 | Predator (Minimal Wear)",
   *       "average": 12685,
   *       "game_id": 730,
   *       "type": "Rifle",
   *       "collection": "The Dust Collection",
   *       "ru_name": "AK-47 | Хищник (Немного поношенное)"
   *     }
   *   ]
   * }
   */
  public getSteamItems(game: number = 730, highest_offer: '0' | '1' = '0'): Promise<IGetSteamItems> {
    return this.get(`get-steam-items`, qs.stringify({ game, highest_offer }));
  }

  /**
   * Check if user is in system - `/merchant/user`
   *
   * @param steam_id Steam ID of the user
   * @param merchant Your merchant name
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "user": {
   *     "steam_id": "string",
   *     "can_sell": true,
   *     "can_p2p": true,
   *     "tradelink": "string"
   *   }
   * }
   */
  public getMerchantUser(steam_id: string, merchant: string): Promise<IMerchantUser> {
    return this.get(`merchant/user`, qs.stringify({ steam_id, merchant }));
  }

  /**
   * Insert a user into a system - `/merchant/user`
   *
   * @param merchant Your merchant name
   * @param tradelink User's tradelink
   * @param steam_id Steam ID of the user
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "user": {
   *     "steam_id": "string",
   *     "can_sell": true,
   *     "can_p2p": true,
   *     "tradelink": "string"
   *   },
   *   "msg": "string"
   * }
   */
  public postMerchantUser(merchant: string, tradelink: string, steam_id: string): Promise<IMerchantUser> {
    return this.post(`merchant/user`, { tradelink, steam_id }, qs.stringify({ merchant }));
  }

  /**
   * Fetch user inventory - `/merchant/inventory`
   *
   * Fetch and process user inventory via our system, call this endpoint before calling {@link MerchantInventory|MerchantInventory()} /merchant/inventory GET
   *
   * @param steam_id Steam ID of the user
   * @param merchant Your merchant name
   * @example
   * // example response:
   * {
   *   "success": false,
   *   "msg": "Inventory is closed",
   *   "count": 0
   * }
   */
  public MerchantInventoryUpdate(steam_id: string, merchant: string): Promise<IMerchantInventoryUpate> {
    return this.post(`merchant/inventory`, null, qs.stringify({ steam_id, merchant }));
  }

  /**
   * Get items that you can list for the user - `/merchant/inventory`
   *
   * Display items for the user to select.
   * Will return fetched items by {@link MerchantInventoryUpdate|MerchantInventoryUpdate()} /merchant/inventory POST
   *
   * @param merchant Your merchant name
   * @param steam_id Steam ID of the user
   * @param game Game app_id from supported games (default 730)
   * @param skip (optional) Skip first N items (default 0)
   */
  public MerchantInventory(
    steam_id: string,
    merchant: string,
    game: number = 730,
    skip: number = 0,
  ): Promise<IMerchantInventory> {
    return this.get(`merchant/inventory`, qs.stringify({ steam_id, merchant, game, skip }));
  }

  /**
   * List steam items from inventory - `/merchant/list-items-steam`
   *
   * Which items need to be deposited
   * If instant set to true, the price will be overwritten during processing
   *
   * @param merchant Your merchant name
   * @param steam_id Steam ID of the user
   * @param items Items to list
   * @param item_id Item ID to list
   * @param price Price to list (1000 = 1$)
   * @param instant (optional) Instant listing (default false)
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "msg": "item_not_in_inventory",
   *   "listed": [
   *     {
   *       "item_id": 141414144,
   *       "price": 1000,
   *       "name": "AWP | Asiimov (Field-tested)"
   *     }
   *   ],
   *   "tx_id": "string"
   * }
   */
  public MerchantListItemsSteam(
    merchant: string,
    steam_id: string,
    items: IMerchantListItem[],
  ): Promise<IMerchantListItemsSteam> {
    return this.post(`merchant/list-items-steam`, { items }, qs.stringify({ merchant, steam_id }));
  }

  /**
   * Returns history of deposits - `/merchant/deposits`
   *
   * @param merchant Your merchant name
   * @param steam_id (optional) Steam ID of the user
   * @param tx_id (optional) Transaction ID
   * @example
   * // example response:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": "string",
   *       "costum_id": "string",
   *       "trade_id": "string",
   *       "tradelink": "string",
   *       "steamid_seller": "string",
   *       "created": "2022-04-14T13:39:51.362Z",
   *       "send_until": "2022-04-14T13:39:51.362Z",
   *       "last_updated": "string",
   *       "reason": "string",
   *       "user": {
   *         "name": "string",
   *         "steam_id": "string",
   *         "steam_joined": 0
   *       },
   *       "items": [
   *         {
   *           "item_id": "string",
   *           "price": 0,
   *           "give_amount": 0,
   *           "name": "string",
   *           "status": 5
   *         }
   *       ]
   *     }
   *   ]
   * }
   */
  public MerchantDepositsHistory(
    merchant: string,
    steam_id?: string,
    tx_id?: string,
  ): Promise<IMerchantDepositsHistory> {
    return this.post(`merchant/deposits`, null, qs.stringify({ merchant, steam_id, tx_id }));
  }
  /**
   * Due to the steam update, it became mandatory to pass regularly (we recommend sending once an hour and keep 6 hours from the time we receive it) to be online and sell on the marketplace.
   *
   * Token should be in base64 format and belong to your account.
   *
   * It is recommended to transmit it once an hour to maintain validity, as well as in case of refreshing
   *
   * If the "success" parameter in the response is false, you will not get online and most likely you need to update the token and send a new one
   *
   * @param token Steam access token in base64 format
   * @example
   * // example response:
   * {
   *    "success": false,
   *    "msg": "Need to refresh access token",
   *    "exp": 1712852259
   * }
   */
  public UserSteamToken(token: string) {
    return this.post(`user/steam-token`, { token });
  }
  /**
   * Due to the Steam update we recommend to send this request and do mobile confirmation only if you receive a successful response (success param is true).
   * @param tradeid Created Steam trade id
   * @param waxid Waxpeer uuid trade id (waxid in "send-trade" event OR "costum_id" from another source)
   * @example
   * // example response:
   * {
   *   "success": false,
   *   "msg": "No token found"
   * }
   *
   */
  public steamTrade(tradeid: string, waxid: string) {
    return this.post(`steam-trade`, { tradeid, waxid });
  }

  public async post(url: string, body: any, token?: string): Promise<any> {
    let { baseUrl, api, version } = this;
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`;
    if (token) newUrl += `&${token}`;
    try {
      return (
        await axios.post(newUrl, body, {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
          cancelToken: this.newAxiosCancelationSource(60000),
          timeout: 60000,
        })
      ).data;
    } catch (e) {
      throw e?.message;
    }
  }

  public async get(url: string, token?: string): Promise<any> {
    let { baseUrl, api, version } = this;
    let newUrl = `${baseUrl}/${version}/${url}?api=${api}`;
    if (token) newUrl += `&${token}`;
    try {
      return (
        await axios.get(newUrl, {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
          cancelToken: this.newAxiosCancelationSource(60000),
          timeout: 60000,
        })
      ).data;
    } catch (e) {
      throw e?.message;
    }
  }
  private newAxiosCancelationSource(ms: number = 1) {
    const tokenSource = axios.CancelToken.source();
    setTimeout(() => {
      tokenSource.cancel();
    }, ms);
    return tokenSource.token;
  }
}
