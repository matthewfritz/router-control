/**
 * @name RouterResolver
 *
 * Handles the resolution of the router type.
 */
class RouterResolver
{
	/**
	 * @var Array of command-line arguments
	 */
	args = [];

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
		let fingerprints = [];
		let returnVal = false;

		// check the <head> section for the 'ARRIS Group, Inc' string
		fingerprints.push(
			await this.page.$eval('head', headElement => {
				return headElement.innerHTML.indexOf('ARRIS Group, Inc') != -1;
			})
		);

		// check the <script> section(s) for the ' ARRIS ' string
		fingerprints.push(
			await this.page.$$eval('script', scriptElements => {
				return scriptElements.filter(el => {
					return el.innerText.indexOf(" ARRIS ") != -1;
				});
			})
		);

		return this.checkFingerprints(fingerprints);
	}

	/**
	 * Returns whether the array of fingerprint returns to see whether at least
	 * one fingerprint resulted in a match.
	 *
	 * @param fingerprints Array of fingerprint returns
	 * @return bool
	 */
	checkFingerprints(fingerprints) {
		// iterate over our returns from the evaluations and figure out if
		// we have anything that fingerprinted the router
		let returnVal = false;
		for(const fp of fingerprints) {
			returnVal = returnVal || fp;
		}
		return returnVal;
	}
}