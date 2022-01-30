const { RouterResolver } = require('./src/modules/resolvers/RouterResolver.js');

const puppeteer = require('puppeteer');
require('dotenv').config();

// get the process arguments
const args = process.argv.slice(2); // don't process "node" or the script name

if(args.length > 0) {
	(async() => {
		let browserOptions = {
			timeout: process.env.ROUTER_TIMEOUT
		};
		const browser = await puppeteer.launch(browserOptions);
		const page = await browser.newPage();

		await page.goto(process.env.ROUTER_URL);

		// figure out what kind of router we are dealing with and then process
		// the desired command(s)
		const router = await new RouterResolver(args, page).resolve(page);
		if(router != null) {
			console.log("Resolved router type: " + router.type);
			await router.process(process.env.ROUTER_USERNAME, process.env.ROUTER_PASSWORD);
		}
		else
		{
			console.log("Could not resolve the router type. Exiting...");
		}

		// close the page and browser (ignoring any errors) and echo a finished message
		await page.close().catch((e) => {});
		await browser.close().catch((e) => {});
		console.log("");
		console.log("Done.");
	})();
}
else
{
	console.log("No commands provided. Exiting.");
}
