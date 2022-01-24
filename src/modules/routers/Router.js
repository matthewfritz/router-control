/**
 * General class for router implementations.
 *
 * @author Matthew Fritz <mattf@burbankparanormal.com>
 */
class Router
{
	/**
	 * Array of command-line arguments
	 */
	args = [];

	/**
	 * Puppeteer page instance
	 */
	page = null;

	/**
	 * Router type string
	 */
	type = "";

	/**
	 * Constructs a new Router instance.
	 *
	 * @param args The command-line arguments
	 * @param page The Puppeteer page instance
	 * @param type The router type
	 */
	constructor(args, page, type) {
		this.args = args;
		this.page = page;
		this.type = type;
	}
	
	/**
	 * Processes the command(s) to execute based on the instance arguments.
	 *
	 * @param username The username for auth
	 * @param password The password for auth
	 */
	process(username, password) {
		console.log("Processing operation(s) for " + this.type + " router...");
		console.log("");
	}
}

module.exports = { Router };