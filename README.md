# perk-coverage

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Useful websites
APi Docs : [https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html#schema_Destiny-DestinyComponentType]
Bungie OAuth: [https://github.com/Bungie-net/api/wiki/OAuth-Documentation]
Usage Wiki : [https://github.com/vpzed/Destiny2-API-Info/wiki]
Dataset explorer: [https://data.destinysets.com/]
Bungie Apps: [https://www.bungie.net/en/Application]
Destiny Bot : [https://warmind.io/]

### Tools used during dev
Ngrok for tunneling OAuth2: [https://dashboard.ngrok.com]
Firebase: [https://console.firebase.google.com/project/destiny-perk-coverage]

### Recent discoveries

Instance.State is a bitmask
Locked: 1 - If this bit is set, the item has been "locked" by the user and cannot be deleted. You may want to represent this visually with a "lock" icon.
Tracked: 2 - If this bit is set, the item is a quest that's being tracked by the user. You may want a visual indicator to show that this is a tracked quest.
Masterwork: 4 If this bit is set, the item has a Masterwork plug inserted. This usually coincides with having a special "glowing" effect applied to the item's icon.

