/**
 * Handles timer functionality for when router operations are running.
 *
 * @author Matthew Fritz <mattf@burbankparanormal.com>
 */
class OperationTimer
{
	/**
	 * Total estimated elapsed interval time in milliseconds
	 */
	#elapsed = 0;

	/**
	 * Delay for each interval in milliseconds
	 */
	#interval = 15000;

	/**
	 * Name of the operation that is executing
	 */
	#name = "";

	/**
	 * Whether to output progress updates during each interval
	 */
	#showProgress = true;

	/**
	 * Time in milliseconds when the operation began
	 */
	#startTime = 0;

	/**
	 * Time in milliseconds when the operation ended
	 */
	#stopTime = 0;

	/**
	 * Handle to the timer interval
	 */
	#timerHandle = null;

	/**
	 * Constructs a new OperationTimer instance with the given operation name.
	 *
	 * @param name The name of the operation that is running
	 */
	constructor(name) {
		this.#name = name;
	}

	/**
	 * Processes the interval.
	 */
	executeInterval() {
		this.#elapsed += $this.#interval;
		if(this.#showProgress) {
			console.log("* Elapsed time for operation " + this.#name + ": " + OperationTimer.formatInterval(this.#elapsed));
		}
	}

	/**
	 * Formats and returns a string based on the number of milliseconds.
	 *
	 * @param milliseconds The number of milliseconds to format
	 * @return string
	 */
	static formatInterval(milliseconds) {
		let elapsedHour = 0;
		let elapsedMin = 0;
		let elapsedSec = 0;
		let elapsedMillis = 0;

		// calculate the number of hours
		while(milliseconds >= 3600000) {
			elapsedHour++;
			milliseconds -= 3600000;
		}

		// calculate the number of minutes
		while(milliseconds >= 60000) {
			elapsedMin++;
			milliseconds -= 60000;
		}

		// calculate the number of seconds
		while(milliseconds >= 1000) {
			elapsedSec++;
			milliseconds -= 1000;
		}

		// the number of milliseconds is whatever is left
		elapsedMillis = milliseconds;

		// format the individual pieces and then create a delimited string
		let formattedPieces = [];
		if(elapsedHour > 0) {
			formattedPieces.push((elapsedHour == 1) ? elapsedHour + " hour" : elapsedHour + " hours");
		}
		if(elapsedMin > 0) {
			formattedPieces.push((elapsedMin == 1) ? elapsedMin + " minute" : elapsedMin + " minutes");
		}
		if(elapsedSec > 0) {
			formattedPieces.push((elapsedSec == 1) ? elapsedSec + " second" : elapsedSec + " seconds");
		}
		if(elapsedMillis > 0) {
			formattedPieces.push((elapsedMillis == 1) ? elapsedMillis + " millisecond" : elapsedMillis + " milliseconds");
		}

		return formattedPieces.join(", ");
	}

	/**
	 * Returns the interval delay in milliseconds.
	 *
	 * @return int
	 */
	getIntervalDelay() {
		return this.#interval;
	}

	/**
	 * Resets the interval delay to the default of 15 seconds.
	 */
	resetIntervalDelay() {
		this.setIntervalDelay(15000);
	}

	/**
	 * Sets the interval delay in milliseconds.
	 *
	 * @param delay The delay in milliseconds
	 */
	setIntervalDelay(delay) {
		this.#interval = delay;
	}

	/**
	 * Sets whether to show progress updates for each interval.
	 *
	 * @param showProgress True to show updates, false otherwise
	 */
	setShowProgress(showProgress) {
		this.#showProgress = showProgress;
	}

	/**
	 * Starts the timer.
	 */
	async start() {
		if(this.#timerHandle == null) {
			console.log("* Starting operation timer for " + this.#name + "...");
			this.#elapsed = 0;
			this.#startTime = Date.now();
			this.#stopTime = 0;
			this.#timerHandle = setInterval(this.executeInterval, this.#interval);
		}
		else
		{
			console.log("Operation timer for " + this.#name + " is already running.");
		}
	}

	/**
	 * Stops the timer and clears the interval.
	 */
	async stop() {
		if(this.#timerHandle != null) {
			console.log("* Stopping operation timer for " + this.#name + "...");
			clearInterval(this.#timerHandle);
			this.#timerHandle = null;
			this.#stopTime = Date.now();

			// calculate and output the elapsed time for the operation
			this.#elapsed = this.#stopTime - this.#startTime;
			console.log("* Total time elapsed for operation " + this.#name + ": " + OperationTimer.formatInterval(this.#elapsed));

			console.log("* Stopped operation timer for " + this.#name + ".");
		}
		else
		{
			console.log("Operation timer for " + this.#name + " is not currently running.");
		}
	}
}

module.exports = { OperationTimer };