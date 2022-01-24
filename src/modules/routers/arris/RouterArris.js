const { OperationTimer } = require('../../timers/OperationTimer.js');
const { Router } = require('../Router.js');

/**
 * Handles operations specific to ARRIS routers.
 *
 * @author Matthew Fritz <mattf@burbankparanormal.com>
 */
class RouterArris extends Router
{
	/**
	 * Constructs a new RouterArris instance.
	 *
	 * @param args The command-line arguments
	 * @param page The Puppeteer page instance
	 */
	constructor(args, page) {
		super(args, page, "ARRIS");
	}

	/**
	 * Processes the ARRIS router command(s) to execute based on the instance arguments.
	 *
	 * @param username The username for auth
	 * @param password The password for auth
	 */
	process(username, password) {
		super.process(username, password);

		// process the ARRIS command(s)
	}
}

module.exports = { RouterArris };