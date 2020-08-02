const db = require("quick.db");

/* Represents the main client
 * @arg {Object} [options] Options
 * @arg {Array<String>} [economymanagers] People who can manage balances of users.
 * @arg {String} [prefix] Cash prefix, defaults to `$`.
 * @arg {Boolean} [consolelogs] Should the console log actions?
 */

class DiscordEcoClient {
  constructor(options) {
    this.options = Object.assign(
      {
        economymanagers: null,
        prefix: "$",
        consolelogs: true
      },
      options
    );
  }
  AddToBalance(userid, amount) {
    db.add(`balance.${userid}`, amount);
    if (this.options.consolelogs) {
      console.log(
        `Added ${
          this.options.prefix
        }${amount} to ${userid}'s balance. They now has ${
          this.options.prefix
        }${db.get(`balance.${userid}`)}`
      );
    }
  }
}

module.exports = { Main: DiscordEcoClient };
