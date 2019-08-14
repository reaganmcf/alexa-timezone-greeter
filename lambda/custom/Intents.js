//Mark: Below are all of the Custom Intents
/**
 * Custom intent. Called when the contact wants to add a new contact
 */
const GREET_INTENT = 'GreetIntent';

/**
 * Custom intent. Called when the user wants to change their intent message
 */
const CHANGE_GREETING_INTENT = 'ChangeGreetingIntent';

//MARK: Below are all of the default Aamazon.<any> Intents
/**
 * AMAZON intent. Lets the suer cancel a task or completely exit the skill
 */
const AMAZON_CANCEL_INTENT = 'AMAZON.CancelIntent';

/**
 * AMAZON intent. Called when the contact asks for help about the skill
 */
const AMAZON_HELP_INTENT = 'AMAZON.HelpIntent';

/**
 * AMAZON intent. Lets the contact stop an action or completely exit the skill
 */
const AMAZON_STOP_INTENT = 'AMAZON.StopIntent';

/**
 * AMAZON intent. Provides a fallback for contact utterances that do not match any of our skill's intents
 */
const AMAZON_FALLBACK_INTENT = 'AMAZON.FallbackIntent';

module.exports = {
	GREET_INTENT,
	CHANGE_GREETING_INTENT,
	AMAZON_CANCEL_INTENT,
	AMAZON_FALLBACK_INTENT,
	AMAZON_HELP_INTENT,
	AMAZON_STOP_INTENT
};
