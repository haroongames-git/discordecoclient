# Discord Economy Client
### Read me before installing!
You need to install quick.db before using this library, using:
```bat
npm install --save quick.db
```
Then, require the library, and create the Client, using:
```js
const { Main } = require('discordecoclient')
const EcoClient = new Main(options: {
    economymanagers: [], // Array of User IDs
    prefix: "$", // Cash prefix
    consolelogs: true // Should changes to users be logged in the console
})
// or
const DiscordEcoClient = require('discordecoclient')
const EcoClient = new DiscordEcoClient.Main(options: {
    economymanagers: [],
    prefix: "$",
    consolelogs: true
})
```
