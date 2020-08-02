const db = require("quick.db");
const EventEmitter = require('events')
const discordjs = require('discord.js')
const eris = require('eris')

class UnknownError extends Error {}
class EconomyError extends Error {}

/* Represents the main client
 * @arg {Object} client The bot client
 * @arg {Object} [options] Options
 * @arg {Array<String>} [options.economymanagers] People who can manage balances of users.
 * @arg {String} [options.prefix] Cash prefix, defaults to `$`.
 * @arg {Boolean} [options.consolelogs] Should the console log actions?
 */

class DiscordEcoClient extends EventEmitter {
  constructor(options) {
    this.options = Object.assign(
      {
		client: null,
        economymanagers: null,
        prefix: "$",
        consolelogs: true
      },
      options
    );
    this.ready = false
    this.on('discord_connected', async () => {
        if (!this.options.client) {
			throw new UnknownError("No client was given in the options. If you wish to use no client (not recommended), set it to 'Unspecified'.")
		}
		if ("Unspecified" != this.options.client || !typeof this.options.client == 'object') {
			throw new UnknownError("An unknown client was given in the options. If you wish to use no client (not recommended), set it to 'Unspecified'.")
		}
		this.ready = true
		console.log("Discord Economy Client by HaroonGames has loaded! (You cannot opt-out of these notifications without editing the source code.)")
    })
  }
  AddToBalance(userid, amount) {
    if (!userid) {
      throw new EconomyError("No UserID was given.")
    }
    if (!amount) {
      throw new EconomyError("No amount to add was given.")
    }
    db.add(`balance.${userid}`, amount);
    if (this.options.consolelogs) {
      console.log(
        `Added ${
          this.options.prefix
        }${amount} to ${userid}'s balance. They now have ${
          this.options.prefix
        }${db.get(`balance.${userid}`)}`
      );
    }
  }
  RemoveFromBalance(userid, amount) {
    if (!userid) {
      throw new EconomyError("No UserID was given.")
    }
    if (!amount) {
      throw new EconomyError("No amount to add was given.")
    }
    db.add(`balance.${userid}`, 0 - amount);
    if (this.options.consolelogs) {
      console.log(
        `Took ${
          this.options.prefix
        }${amount} to ${userid}'s balance. They now have ${
          this.options.prefix
        }${db.get(`balance.${userid}`)}`
      );
    }
	return new Promise({user_id: userid, oldbalance: db.get(`balance.${userid}`) + amount, newbalance: db.get(`balance.${userid}`)})
  }
  Fetch(userid) {
    if (!userid) {
      throw new EconomyError("No UserID was given.")
    }
    return new Promise({user_id: userid, balance: db.get(`balance.${userid}`)})
  }
}

module.exports = { Main: DiscordEcoClient , Help: console.log(`Seems like you required help! Don't worry!
[Note: put EcoClient.emit('discord_connected') in your client.on('ready'/'connect') event, so the economy client knows when to start working!]`)};
