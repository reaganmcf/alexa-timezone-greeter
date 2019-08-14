const AWS = require('aws-sdk');
const config = require('./config');
AWS.config.update(config.AWS_SETTINGS);
let dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function updateGreetingHandler(val, deviceId) {
	//check if the deviceId already has a document in the database
	let params = {
		TableName: 'alexa-timezone-welcome',
		Key: {
			deviceId: { S: deviceId }
		},
		UpdateExpression: 'set greeting = :n',
		ExpressionAttributeValues: {
			':n': { S: val }
		}
	};

	return await dynamoDB
		.updateItem(params)
		.promise()
		.then((res) => {
			console.log(res);
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
}

async function getGreetingHandler(deviceId) {
	let params = {
		TableName: 'alexa-timezone-welcome',
		Key: {
			deviceId: { S: deviceId }
		}
	};

	return await dynamoDB
		.getItem(params)
		.promise()
		.then((res) => {
			return res.Item.greeting.S;
		})
		.catch((err) => {
			return false;
		});
}

module.exports = {
	getGreetingHandler,
	updateGreetingHandler
};
