const fs = require('fs');
const os = require('os');
const path = require('path');

const envFilePath = path.resolve(__dirname, '../.env');

// read .env file & convert to array
const readEnvVars = () => fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);

const getEnvValue = key => {
	// find the line that contains the key (exact match)
	const matchedLine = readEnvVars().find(line => line.split('=')[0] === key);
	// split the line (delimiter is '=') and return the item at index 2
	return matchedLine !== undefined ? matchedLine.split('=')[1] : null;
};

/**
 *
 * @param {string} key Key to update/insert
 * @param {string} value Value to update/insert
 */
const setEnvValue = (key, value) => {
	const envVars = readEnvVars();
	const targetLine = envVars.find(line => line.split('=')[0] === key);
	if (targetLine !== undefined) {
		// update existing line
		const targetLineIndex = envVars.indexOf(targetLine);
		// replace the key/value with the new value
		envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
	} else {
		// create new key value
		envVars.push(`${key}="${value}"`);
	}
	// write everything back to the file system
	fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

const envMiddleware = (req, res, next) => {
	req.getEnvValue = getEnvValue;
	req.setEnvValue = setEnvValue;
	next();
};

module.exports = envMiddleware;
