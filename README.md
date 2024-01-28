[WaxPeer](https://waxpeer.com) API wrapper for Node.js

Full API documentation [here](https://api.waxpeer.com/docs)

Trade websocket documentation [here](https://docs.waxpeer.com/?method=websocket)

## Installation

```sh
$ npm install waxpeer
```

### Initialization

```typescript
import { Waxpeer, TradeWebsocket, WebsiteWebsocket } from 'waxpeer';

//API wrapper
const WP = new Waxpeer(WAXPEER_API);
//Trade websocket
const TS = new TradeWebsocket(WAXPEER_API, STEAM_ID, TRADELINK);
//Website websocket
const WS = new WebsiteWebsocket(WAXPEER_API, [
  'add_item',
  'remove',
  'update_item',
]);
```

### Fetch your user data

```typescript
const user = await WP.getProfile();
console.log(user);
```

### Fetch your trades and transactions history

```typescript
const history = WP.myHistory(0, '2022-11-11', '2022-12-12', 'DESC');
console.log(history);
```

### Change your tradelink

```typescript
let data = await WP.changeTradeLink(
  'https://steamcommunity.com/tradeoffer/new/?partner=900267897&token=P2YkRJOk'
);
console.log(data);
```

### Save new Steam API key

```typescript
let data = await WP.setMyKeys('11EDA9771EB4A200B579A530009CC000');
console.log(data);
```

### Buy items using item_id and send to specific tradelink

```typescript
const purchase = await WP.buyItemWithId(
  17441538677,
  798500,
  'oFvyi0Ma',
  '378049039'
);
console.log(purchase);
```

### Buy item by name and send to specific tradelink

```typescript
const purchase = await WP.buyItemWithName(
  'AK-47 | Redline (Field-Tested)',
  15000,
  'oFvyi0Ma',
  '378049039',
  null,
  'csgo'
);
console.log(purchase);
```

### Fetch all unique items and their min price and count

```typescript
const items = await WP.getPrices('csgo');
console.log(items);
```

### Fetch all dopplers phases by filters

```typescript
const items = await WP.getPricesDopplers('any');
console.log(items);
```

### Fetch all listings by names

```typescript
const items = await WP.massInfo(['AK-47 | Redline (Field-Tested)', 'csgo']);
console.log(items);
```

### Search available items by name(s)

```typescript
const items = await WP.searchItems(['AK-47 | Redline (Field-Tested)', 'csgo']);
console.log(items);
```

### Checking the status of many steam trades by project_id identifier

```typescript
const items = await WP.customTradeRequest(['my_id_1', 'my_id_2']);
console.log(items);
```

### Checking the status of many steam trades by Waxpeer ids

```typescript
const items = await WP.tradeRequestStatus(['12345', '23456']);
console.log(items);
```

### Fetches available item(s) based on the item_id(s) passed in query

```typescript
const items = await WP.checkItemAvailability(['17441538677', '17441538678']);
console.log(items);
```

### Check tradelink validity

```typescript
const data = await WP.validateTradeLink(
  'https://steamcommunity.com/tradeoffer/new/?partner=900267897&token=P2YkRJOk'
);
console.log(data);
```

### Get recent purchases by filters

```typescript
const data = await WP.getHistory('153912146', 'ssR242yo');
console.log(data);
```

### Fetch trades that need to be sent

```typescript
const data = await WP.readyToTransferP2P('11EDA9771EB4A200B579A530009CC000');
console.log(data);
```

### Force p2p status check. Recommended for usage with poor network connections

```typescript
const data = await WP.checkWssUser('765611983383140000');
console.log(data);
```

### Edit price for listed items

```typescript
const data = await WP.editItems([{ item_id: 1, price: 1 }], 'csgo');
console.log(data);
```

### Fetch my inventory

```typescript
const data = await WP.fetchInventory('csgo');
console.log(data);
```

### Get items that you can list for sale

```typescript
const data = await WP.getMyInventory(0, 'csgo');
console.log(data);
```

### Get listed steam items

```typescript
const data = await WP.myListedItems('csgo');
console.log(data);
```

### List steam items from inventory

```typescript
const data = await WP.listItemsSteam([{ item_id: 1, price: 1 }], 'csgo');
console.log(data);
```

### Remove item(s) by item id(s)

```typescript
const data = await WP.removeItems([1, 2, 3, 4]);
console.log(data);
```

### Remove all listings

```typescript
const data = await WP.removeAll('csgo');
console.log(data);
```

### Buy order trigger history

```typescript
const data = await WP.buyOrderHistory(0, 'csgo');
console.log(data);
```

### Active buy orders. Sorted by price DESC, if a filter by name is specified

```typescript
const data = await WP.buyOrders(
  0,
  'AK-47 | Redline (Field-Tested)',
  '1',
  'csgo'
);
console.log(data);
```

### Create a buy order to auto purchase items. Currently independent of the p2p status of the user

```typescript
const data = await WP.createBuyOrder(
  'AK-47 | Redline (Field-Tested)',
  5,
  15000,
  'csgo'
);
console.log(data);
```

### Edit buy order

```typescript
const data = await WP.editBuyOrder(123, 5, 1000);
console.log(data);
```

### Remove buy order(s)

```typescript
const data = await WP.removeBuyOrder([1, 2, 3]);
console.log(data);
```

### Remove all buy orders by filters

```typescript
const data = await WP.removeAllOrders('csgo');
console.log(data);
```

### Fetches items based on the game you pass as a query

```typescript
const data = await WP.getItemsList(0, null, 'knife', 'DESC');
console.log(data);
```

### Fetches recommended item price and other info

```typescript
const data = await WP.getSteamItems(730);
console.log(data);
```

### Merchant. Check if user is in system

```typescript
const data = await WP.getMerchantUser('76561198000000000', 'my_merchant');
console.log(data);
```

### Merchant. Insert a user into a system

```typescript
const data = await WP.postMerchantUser(
  'my_merchant',
  'https://steamcommunity.com/tradeoffer/new/?partner=900267897&token=P2YkRJOk',
  '76561198000000000'
);
console.log(data);
```

### Merchant. Fetch user inventory

```typescript
const data = await WP.MerchantInventoryUpdate(
  '76561198000000000',
  'my_merchant'
);
console.log(data);
```

### Merchant. Get items that you can list for the user

```typescript
const data = await WP.MerchantInventory(
  '76561198000000000',
  'my_merchant',
  730
);
console.log(data);
```

### Merchant. List steam items from inventory

```typescript
const data = await WP.MerchantListItemsSteam(
  'my_merchant',
  '76561198000000000',
  [{ item_id: 1, price: 1 }]
);
console.log(data);
```

### Merchant. Returns history of deposits

```typescript
const data = await WP.MerchantDepositsHistory(
  'my_merchant',
  '76561198000000000',
  'aaabe17b-dddd-4444-affd-dcad3fa6fbbe'
);
console.log(data);
```

### Trade websocket events that you need to implement

```typescript
TS.on('send-trade', (message: TradeWebsocketCreateTradeData) => {
  console.log(message);
});
TS.on('cancelTrade', (message: TradeWebsocketCancelTradeData) => {
  console.log(message);
});
TS.on('accept_withdraw', (message: TradeWebsocketAcceptWithdrawData) => {
  console.log(message);
});
```

### Website websocket events

```typescript
//manual sub events
WS.on('add_item', (message: ItemChangeEvent) => {
  console.log(message); //waxpeer new item event
});
WS.on('remove', (message: ItemChangeEvent) => {
  console.log(message); //waxpeer item removed event
});
WS.on('update_item', (message: UpdateItemEvent) => {
  console.log(message); //waxpeer item price change event
});
//auto sub after auth
WS.on('change_user', (message: ChangeUserEvent) => {
  if (message.name === 'wallet') console.log(message); //balance change event
});
WS.on('steamTrade', (message: ItemChangeEvent) => {
  console.log(message); //waxpeer new item event
});
```

### API error handling

```typescript
try {
  let user = await WP.getProfile();
  console.log(user);
} catch (e) {
  let timeout = axios.isCancel(e) ? true : false;
  let response = e?.response?.data;
  let status_code = e?.response?.status;
  console.log({ timeout, status_code, response }); //{ timeout: false, status_code: 403, response: { success: false, msg: 'wrong api' } }
}
```
