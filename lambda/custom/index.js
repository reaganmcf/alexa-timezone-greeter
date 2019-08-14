const Alexa = require('ask-sdk-core');
const fetch = require('node-fetch');

const API = require('./api');
const Requests = require('./Requests');
const Messages = require('./Messages');
const Intents = require('./Intents');
const Timezones = require('./Timezones');

//Mark: Handlers for Requests
/**
 * Handler for a Launch Request
 */
const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === Requests.LAUNCH_REQUEST;
	},
	async handle(handlerInput) {
		const { responseBuilder } = handlerInput;
		return handlerInput.responseBuilder.speak(Messages.WELCOME).reprompt(Messages.WELCOME).getResponse();
	}
};

/**
 * Handler for a SessionEnded Request
 */
const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.SESSION_ENDED_REQUEST;
	},
	handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		console.log(`Session ended with reason: ${request.reason}`);
		return handlerInput.responseBuilder.speak('Goodbye!').getResponse();
	}
};

//Mark: Handlers for Custom Intents

const GreetIntentHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.GREET_INTENT;
	},
	async handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		const { apiAccessToken, apiEndpoint, device } = handlerInput.requestEnvelope.context.System;
		//find device time zone
		let res = await fetch(apiEndpoint + '/v2/devices/' + device.deviceId + '/settings/System.timeZone', {
			headers: {
				Authorization: 'Bearer ' + apiAccessToken
			}
		}).then((res) => res.json());
		console.log('timezone is ' + res);
		let tzone = Timezones.getTimezoneObjectFromTimezone(res);

		//calculate greeting based on string

		console.log(tzone);

		let temp = tzone.time.split(' ');
		let tTime = parseInt(temp[0].substring(0, 1));
		tTime += temp[1] === 'PM' ? 12 : 0;

		let prefix = '';
		if (tTime < 10) {
			prefix = 'Good Morning, ';
		} else if (tTime >= 10 && tTime <= 16) {
			prefix = 'Good Afternoon, ';
		} else {
			prefix = 'Good Evening, ';
		}

		let greetingHandler = await API.getGreetingHandler(device.deviceId);
		let suffix = '';
		if (!greetingHandler || greetingHandler == false) {
			suffix = 'how are you';
		} else {
			suffix = greetingHandler;
		}
		return handlerInput.responseBuilder.speak(prefix + suffix).getResponse();
	}
};

const ChangeGreetingIntentHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.CHANGE_GREETING_INTENT;
	},
	async handle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		const { apiAccessToken, apiEndpoint, device } = handlerInput.requestEnvelope.context.System;
		const slot = request.intent.slots.NewGreeting;
		console.log(slot);
		await API.updateGreetingHandler(slot.value, device.deviceId);
		return handlerInput.responseBuilder.speak('Changed your greeting handler to ' + slot.value).getResponse();
	}
};

//Mark: Handlers for AMAZON default intents
/**
 * Handler for the AMAZON.HelpIntent
 */
const HelpIntentHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return request.type === Requests.INTENT_REQUEST && request.intent.name === Intents.AMAZON_HELP_INTENT;
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder.speak(Messages.HELP).reprompt(Messages.HELP).getResponse();
	}
};

/**
 * Handler for the AMAZON.StopIntent and AMAZON.CancelIntent
 */
const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		const { request } = handlerInput.requestEnvelope;
		return (
			request.type === Requests.INTENT_REQUEST &&
			(request.intent.name === Intents.AMAZON_CANCEL_INTENT || request.intent.name === Intents.AMAZON_STOP_INTENT)
		);
	},
	handle(handlerInput) {
		return handlerInput.responsebuilder.speak(Messages.CANCEL).getResponse();
	}
};

/**
 * Handler for any unexpected errors
 */
const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`Error handled: ${error.message}`);
		return handlerInput.responseBuilder.speak(Messages.ERROR).getResponse();
	}
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
	.addRequestHandlers(
		LaunchRequestHandler,
		SessionEndedRequestHandler,
		GreetIntentHandler,
		ChangeGreetingIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();
