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
    client: client, // Your bot client.
    economymanagers: [], // Array of User IDs
    prefix: "$", // Cash prefix
    consolelogs: true // Should changes to users be logged in the console
})
// or
const DiscordEcoClient = require('discordecoclient')
const EcoClient = new DiscordEcoClient.Main(options: {
    client: client,
    economymanagers: [],
    prefix: "$",
    consolelogs: true
})
```

EcoClient.AddToBalance(UserID, Amount)
```js
const EcoClient = new Main(options: {
    client: client,
    economymanagers: [],
    prefix: "$",
    consolelogs: true
})
EcoClient.AddToBalance(UserID, Amount)
// Expected Promise result:
// {user_id, oldbalance, newbalance}
```

EcoClient.RemoveFromBalance(UserID, Amount)
```js
const EcoClient = new Main(options: {
    client: client,
    economymanagers: [],
    prefix: "$",
    consolelogs: true
})
EcoClient.RemoveFromBalance(UserID, Amount)
// Expected Promise result:
// {user_id, oldbalance, newbalance}
```

EcoClient.Fetch(UserID)
```js
const EcoClient = new Main(options: {
    client: client,
    economymanagers: [],
    prefix: "$",
    consolelogs: true
})
EcoClient.Fetch(UserID)
// Expected Promise result:
// {user_id, balance}
```

EcoClient.Work(UserID, MinimumPayout, MaximumPayout, Jobs)
```js
const EcoClient = new Main(options: {
    client: client,
    economymanagers: [],
    prefix: "$",
    consolelogs: true
})
EcoClient.Work(UserID, Amount)
// Expected Promise result:
// {user_id, oldbalance, newbalance, job, got}
```

Example bot (using Eris):
```js
const Eris = require('eris')
const { Main } = require('discordecoclient')
const client = new Eris(token)
const EcoClient = new Main({
  client: client,
  economymanagers: [],
  prefix: "$",
  consolelogs: true
})

client.on('connect', () => {
  console.log("Connected to Discord's servers!")
  EcoClient.emit('discord_connected')
})

const commands = [
  {
    name:"addbal",
    run:async (message, args) => {
     var profile = await EcoClient.AddToBalance(message.author.id, args[0])
     client.createMessage(message.channel.id, `You just added ${EcoClient.options.prefix}${args[0]} to your balance of ${EcoClient.options.prefix}${profile.oldbalance}, and you now have ${EcoClient.options.prefix}${profile.newbalance}.`)
  }
  },
  {
    name: "removebal",
    run:async (message, args) => {
      var profile = await EcoClient.RemoveFromBalance(message.author.id, args[0])
      client.createMessage(message.channel.id, `You just removed ${EcoClient.options.prefix}${args[0]} from your balance of ${EcoClient.options.prefix}${profile.oldbalance}, and you now have ${EcoClient.options.prefix}${profile.newbalance}.`)
    }
  },
  {
    name: "bal"
    run:async (message, args) => {
      var profile = await EcoClient.Fetch(message.author.id)
      client.createMessage(message.channel.id, `You have ${EcoClient.options.prefix}${profile.balance}.`)
    }
  },
  {
    name: "work"
    run: async (message, args) => {
      var profile = await EcoClient.Work(message.author.id, 100, 1000, ["Cashier", "Robber", "Police Officer"])
      client.createMessage(message.channel.id, `You work as a ${profile.job} and got ${EcoClient.options.prefix}${profile.got}! You now have ${profile.newbalance}.`)
    }
  }
]

client.on('messageCreate', (msg) => {
  if (msg.author.bot || !msg.content.startsWith('!' /* Chosen prefix */)) return
  commands.forEach(command => {
    var args = msg.content.split(' ')
    var usercommand = args.shift();
    if (usercommand === command.name) command.run(msg, args)
  })
})
```
