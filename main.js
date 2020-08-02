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
    return new Promise({user_id: userid, oldbalance: db.get(`balance.${userid}`) - amount, newbalance: db.get(`balance.${userid}`)})
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
  Work(userid, min_payout, max_payout, jobs) {
    if (!userid) {
      throw new EconomyError("No UserID was given.")
    }
    if (!min_payout) {
      throw new EconomyError("No minimum payout was given.")
    }
    if (!max_payout) {
      throw new EconomyError("No maximum payout was given.")
    }
    if (!jobs || !Array.isArray(jobs)) {
      throw new EconomyError("No jobs were given, or the jobs argument isn't an array.")
    }
    var userjob = jobs[Math.floor(Math.random() * (jobs.length + 1))]
    var moneygot = Math.floor(Math.random() * (max_payout - min_payout + 1) + min_payout)
    db.add(`balance.${user_id}`, moneygot)
    return new Promise({
      user_id: userid,
      oldbalance: db.get(`balance.${userid}`) + amount,
      newbalance: db.get(`balance.${userid}`),
      job: userjob,
      got: moneygot
    })
  }
}

module.exports = { Main: DiscordEcoClient , Help: console.log(`Seems like you required help! Don't worry!
[Note: put EcoClient.emit('discord_connected') in your client.on('ready'/'connect') event, so the economy client knows when to start working!]`)};
