import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import { today, primaryGoal, goals } from "user-activity";
import { me as device } from "device";

const DOTW = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

const ACTIVITY_TO_ICON = {
	"activeMinutes": "am",
	"calories": "cals",
	"distance": "dist",
	"elevationGain": "floors",
	"heartRate": "hr",
	"steps": "steps",
	"activeZoneMinutes": "azm",
};

const WIDTH_CENTER = device.screen.width / 2;

let clockElement = document.getElementById("clock");
let timeOfDayElement = document.getElementById("time-of-day");
let dayOfWeekElement = document.getElementById("day-of-week");
let statTextElement = document.getElementById("stat-text");
let statIconElement = document.getElementById("stat-icon");
let statContainer = document.getElementById("stat-container");
let clockContainer = document.getElementById("clock-container");

clock.granularity = "seconds";
clock.addEventListener("tick", (event) => { clockTick(event); });

function clockTick(event) 
{
	let hours = event.date.getHours();
	let minutes = event.date.getMinutes();
	let seconds = event.date.getSeconds();

	if (preferences.clockDisplay === "24h")
	{
		clockElement.text = `${zeroPad(hours)}:${zeroPad(minutes)}`;
		timeOfDayElement.text = "";
		timeOfDayElement.style.display = "none";
	}
	else
	{
		clockElement.text = `${hours % 12 || 12}:${zeroPad(minutes)}`;
		timeOfDayElement.text = hours >= 12 ? "PM" : "AM";
		timeOfDayElement.style.display = "inline";
	}

	dayOfWeekElement.text = DOTW[event.date.getDay()];

	let width = clockElement.getBBox().width;
	clockContainer.width = width;
	clockContainer.x = WIDTH_CENTER - (width / 2);

	updateStat();
}

/**
 * Update the stat that appears along with the clock
 */
function updateStat()
{
	let statVal = today.adjusted[primaryGoal];

	if (primaryGoal === "activeZoneMinutes")
	{
		statTextElement.text = `${statVal.total.toLocaleString()}`;
	}
	else
	{
		statTextElement.text = `${statVal.toLocaleString()}`;
	}
	
	updateStatIcon();

	let width = statIconElement.width + statTextElement.getBBox().width + 5;
	statContainer.width = width;
	statContainer.x = WIDTH_CENTER - (width / 2);
}

/**
 * Updates icon according to primaryGoal and if goal has been completed
 */
function updateStatIcon()
{
	if (today.adjusted[primaryGoal] < goals[primaryGoal])
	{
		statIconElement.href = `icons/stat_${ACTIVITY_TO_ICON[primaryGoal]}_open_48px.png`;
	}
	else
	{
		statIconElement.href = `icons/stat_${ACTIVITY_TO_ICON[primaryGoal]}_solid_48px.png`
	}
}

/**
 * Pad `i` with 0's to be a length of 2
 * @param {*} i 
 */
function zeroPad(i)
{
	return i < 10 ? `0${i}` : `${i}`;
}