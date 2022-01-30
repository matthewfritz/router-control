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
			this.page.removeAllListeners('dialog');
			return true;
		} catch (e) {
			// page closed, something not found, timeout, etc.
			return false;
		}
		return false;
	}

	/**
	 * Navigates to the "Restart Router" screen and presses the "Restart" button
	 * to restart the router.
	 */
	async #restartRouter() {
		const restartTimer = new OperationTimer("restart_router");
		const thePage = this.page;
		const pageUrl = thePage.url() + '?util_restart';
		console.log("Navigating to " + pageUrl + "...");
		thePage.setDefaultTimeout(60000); // extend default timeout to one minute

		const [response] = await Promise.all([
			thePage.waitForNavigation(),
			thePage.goto(pageUrl),
		]);

		// wait for the "Restart" button to be added to the DOM
		await thePage.waitForSelector('input[value="Restart"]');
		thePage.setDefaultTimeout(300000); // 5 minutes since this operation can take a little while

		// an alert dialog here would be the confirm dialog
		thePage.on('dialog', async function(dialog) {
			// apply the OK on the dialog to confirm the restart
			await dialog.accept();
			console.log("");
			console.log("Successfully sent the restart signal to the router!");
			console.log("Restarting the router (this may take a few minutes)...");

			// start the timer
			console.log("");
			restartTimer.start();
			console.log("");
		});

		// press the "Restart" button to restart the router, waiting for the
		// network to become idle (since the heartbeat AJAX calls happen to
		// check whether the router is ready)
		const [restartResponse] = await Promise.all([
			thePage.waitForNetworkIdle({idleTime: 10000}), // network activity needs to stop for 10 seconds
			thePage.click('input[value="Restart"]'),
		]);

		// stop the timer
		console.log("");
		restartTimer.stop();

		console.log("");
		console.log("Successfully restarted the router!");
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

			// check the arguments for the operations we will be performing
			if(this.args.indexOf("--restart-router") != -1) {
				// we will be restarting the router
				await this.#restartRouter();
			}
		} else {
			console.log("Authentication failed.");
		}
	}
}

module.exports = { RouterArris };