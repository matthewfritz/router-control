const puppeteer = require('puppeteer');
const config = require('dotenv').config();

// get the process arguments
const args = process.argv.slice(2); // don't process "node" or the script name

(async() => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(process.env.ROUTER_URL);

	// figure out what kind of router we are dealing with and then process
	// the desired command(s)
	const router = await new RouterResolver(args, page).resolve(page);
	if(router != null) {
		console.log("Resolved " + router.type + " router");
		await router.process(process.env.ROUTER_USERNAME, process.env.ROUTER_PASSWORD);
	}
	else
	{
		console.log("Could not resolve the router implementation. Exiting...");
	}

	// close the browser and echo a finished message
	browser.close();	
	console.log("");
	console.log("Done.");
})();