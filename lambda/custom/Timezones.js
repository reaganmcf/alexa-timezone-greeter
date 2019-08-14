const timezones = [
	{
		name: 'America/Anchorage',
		time: calcTime('-8.0')
	},
	{
		name: 'America/Chicago',
		time: calcTime('-5.0')
	},
	{
		name: 'America/Detroit',
		time: calcTime('-4.0')
	},
	{
		name: 'America/Indianapolis',
		time: calcTime('4.0')
	},
	{
		name: 'America/New_York',
		time: calcTime('-4.0')
	},
	{
		name: 'America/Adak',
		time: calcTime('-9.0')
	},
	{
		name: 'Pacific/Honolulu',
		time: calcTime('-9.0')
	},
	{
		name: 'America/Boise',
		time: calcTime('-6.0')
	},
	{
		name: 'America/Denver',
		time: calcTime('-6.0')
	},
	{
		name: 'America/Phoenix',
		time: calcTime('-6.0')
	},
	{
		name: 'America/Los_Angeles',
		time: calcTime('-7.0')
	}
];

function calcTime(offset) {
	// create Date object for current location
	var d = new Date();

	// convert to msec
	// subtract local time zone offset
	// get UTC time in msec
	var utc = d.getTime() + d.getTimezoneOffset() * 60000;

	// create new Date object for different city
	// using supplied offset
	var nd = new Date(utc + 3600000 * offset);
	// return time as a string
	return nd.toLocaleTimeString('en-US');
}

function getTimezoneObjectFromTimezone(timezoneName) {
	return timezones.filter((a) => a.name === timezoneName)[0];
}

module.exports = {
	getTimezoneObjectFromTimezone,
	timezones
};
