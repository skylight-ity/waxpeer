![WaxPeer](https://pbs.twimg.com/profile_banners/1146046554563895296/1562074133/1080x360)

[WaxPeer](https://waxpeer.com) API wrapper for Node.js

Full API documentation [here](https://api.waxpeer.com/docs)

## Installation

```sh
$ npm install waxpeer
```

### Initialization

```typescript
import { Waxpeer } from 'waxpeer'

const WP = new Waxpeer(WAXPEER_API)
```

### Mirroring items

```typescript
const items = await WP.getItemsList()

console.log(items)
```

### Fetching all items

```typescript
const items = await WP.getPrices()

console.log(items)
```

### Buying items with ID

```typescript
const purchase = await WP.buyItemWithId(17441538677, 798500, 'oFvyi0Ma', '378049039')

console.log(purchase)
```

### Buying items with Name

```typescript
const purchase = await WP.buyItemWithName('AK-47 | Redline (Field-Tested)', 15000, 'oFvyi0Ma', '378049039')

console.log(purchase)
```

### Fetching status of the purchase

```typescript
const status = await WP.tradeRequestStatus(35124)

console.log(status)
```

### Validate tradelink

```typescript
const validate = await WP.validateTradeLink(
  `https://steamcommunity.com/tradeoffer/new/?partner=378049039&token=qPFEAtZR`,
)

console.log(validate)
```

### Search items via market name

```typescript
const search = await wp.searchItems('AK-47 | Redline (Field-Tested)')

console.log(search)
```

### Fetching your account info

```typescript
const user = await WP.getProfile()

console.log(user)
```

### List your items

```typescript
const list = await wp.listItemsSteam([{ item_id: 19095088593, price: 16000 }])

console.log(list)
```

### Get your sell offers

```typescript
const listedItems = await wp.myListedItems()

console.log(listedItems)
```

### Update your sell offer

```typescript
let update = await wp.editItems([{ item_id: 19095088593, price: 11110 }])

console.log(update)
```
