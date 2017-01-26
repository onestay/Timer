// these are the functions needed to control the timer on the front-end
let incrementer;
let startTime;
let lastStopped;

//these are set to something to just have a default state
let delta = 0;
let isReset = 'startup';
let isRunning = false;


exports.startCount = (io) => {
	startTime = Date.now();
	isRunning = true;
	isReset = 'running';
	io.emit('isRunningUpdate', true);
	io.emit('isResetUpdate', 'running')
	increment(io);
	incrementer = setInterval(() => {increment(io)}, 100)
};

exports.stopCount = (io) => {
	lastStopped = Date.now();
	clearInterval(incrementer);
	incrementer = null;
	isRunning = false;
	isReset = 'stopped'
	io.emit('isRunningUpdate', isRunning);
	io.emit('isResetUpdate', isReset);
};

exports.resetCount = (io) => {
	delta = 0;
	isRunning = false;
	isReset = 'startup';
	io.emit('isRunningUpdate', isRunning);
	io.emit('isResetUpdate', isReset);
	io.emit('timeUpdate', { secondsElapsed: delta });
};

exports.resumeCount = (io) => {
	startTime += Date.now() - lastStopped; 
	isRunning = true;
	isReset = 'running';
	io.emit('isRunningUpdate', isRunning);
	io.emit('isResetUpdate', isReset);
	increment(io);
	incrementer = setInterval(() => { increment(io) }, 100)
};

exports.getState = () => {
	return {
		delta: delta,
		isReset: isReset,
		isRunning: isRunning
	};
}

function increment(io) {
	let difference = Math.floor((Date.now() - startTime) / 1000)
	if (difference !== delta) {
		delta = difference;
		console.log(`New delta: ${delta}`);
		io.emit('timeUpdate', { secondsElapsed: delta });
	}
}