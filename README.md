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

### Fetching items
```typescript
const items = await WP.getItemsList()

console.log(items)
```

### Buying items with ID
```typescript
const purchase = await WP.buyItemWithId(17441538677,798500,'oFvyi0Ma','378049039')

console.log(purchase)
```

### Buying items with Name
```typescript
const purchase = await WP.buyItemWithName('AK-47 | Redline (Field-Tested)',15000,'oFvyi0Ma','378049039')

console.log(purchase)
```

### Fetching status of the purchase
```typescript
const status = await WP.tradeRequestStatus(35124)

console.log(status)
```


### Fetching your account info
```typescript
const user = await WP.getProfile()

console.log(user)
```
