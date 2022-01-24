/**
 * @name RouterResolver
 *
 * Handles the resolution of the router type.
 */
class RouterResolver
{
	/**
	 * @var The Puppeteer page instance
	 */
	page = null;

	/**
	 * Constructs a new RouterResolver instance with the specified command-line
	 * arguments and a Puppeteer page instance.
	 *
	 * @param args The command-line arguments
	 * @param page The Puppeteer page instance
	 */
	constructor(args, page) {
		this.args = args;
		this.page = page;
	}

	/**
	 * Resolves and returns a Router instance. Returns null if the router
	 * type could not be resolved.
	 *
	 * @return Router
	 */
	async resolve() {
		if(this.isArris()) {
			return new RouterArris(this.args, this.page);
		}
		return null;
	}

	/**
	 * Returns whether the router is an ARRIS router.
	 *
	 * @return bool
	 */
	isArris() {
		
	}
}