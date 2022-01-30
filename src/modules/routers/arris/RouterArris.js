const { OperationTimer } = require('../../timers/OperationTimer.js');
const { Router } = require('../Router.js');

const util = require('util');

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
	 * Processes the authentication attempt based on the username and password.
	 *
	 * @param string username The username
	 * @param string password The password
	 *
	 * @return bool
	 */
	async #authenticate(username, password) {
		await this.page.waitForSelector('input#UserName');

		// add the username and password to the input fields
		await this.page.type('input#UserName', username);
		await this.page.type('input#Password', password);

		// a dialog pop-up here means the authentication attempt failed, so
		// close the page outright
		let thePage = this.page;
		this.page.on('dialog', async function(dialog) {
			console.log("Authentication error: invalid username or password.");
			await dialog.dismiss();
			await thePage.close().catch((e) => {});
		});

		try {
			// click the "Apply" button to authenticate and go to the admin panel
			const [response] = await Promise.all([
				this.page.waitForNavigation(),
				this.page.click('input.submitBtn'),
			]);

			// wait for the "Basic Setup" <div> to appear since that will mean the
			// authentication attempt was successful
			await this.page.waitForSelector('div#BasicSetup');
			return true;
		} catch (e) {
			// page closed, something not found, timeout, etc.
			return false;
		}
		return false;
	}

	async #restartRouter() {
		console.log("Restarting the router...");

		const pageUrl = this.page.url() + '?util_restart';
		console.log("Navigating to " + pageUrl + "...");
		this.page.setDefaultTimeout(60000);

		const [response] = await Promise.all([
			this.page.waitForNavigation(),
			this.page.goto(pageUrl),
		]);

		await this.page.waitForSelector('input[value="Restart"]');
		const tags = await this.page.$$eval('a', (tags) =>
			tags.map((tag) => tag.innerHTML)
		);
		console.log(tags);
	}

	/**
	 * Processes the ARRIS router command(s) to execute based on the instance arguments.
	 *
	 * @param username The username for auth
	 * @param password The password for auth
	 */
	async process(username, password) {
		super.process(username, password);

		// authenticate with the provided username and password first
		console.log('Authenticating with username and password...');
		let authenticated = await this.#authenticate(username, password)

		// process the ARRIS command(s) if we authenticated successfully
		if(authenticated) {
			console.log("Authentication successful.");
			console.log("");

			await this.#restartRouter();
		} else {
			console.log("Authentication failed.");
		}
	}
}

module.exports = { RouterArris };