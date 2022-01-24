/**
 * @name Router
 *
 * General class for router implementations.
 */
class Router
{
	/**
	 * @var Array of command-line arguments
	 */
	args = [];

	/**
	 * @var Puppeteer page instance
	 */
	page = null;

	/**
	 * @var Router type string
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
	async process(username, password) {
		console.log("This general process() method should be overridden in the child class but it isn't.");
	}
}