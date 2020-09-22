function mySettings(props) 
{
	const { settings, settingsStorage } = props;

	let kpayStatusMessage = settings.kpayStatus || "Unlicensed product. Trial period in progress.";
	let endTrialVisible = (settings.btnEndTrialVisible === undefined ? false : JSON.parse(settings.btnEndTrialVisible));

	if (kpayStatusMessage == 'trial') 
	{
		kpayStatusMessage = getTrialEndsInMessage(props);
	}
	
	return (
		<Page>
			<Section title={<Text bold align="center">Product Status</Text>}>
				<Text align="center">{`${kpayStatusMessage}`}</Text>
				{ endTrialVisible && <Toggle settingsKey="kpayPurchase" label="End Trial Now" /> }  
			</Section>
			<Section title={<Text bold align="center">More Info</Text>}>
				<Text bold>
					Find more clock faces
					<Link source="http://clocks.empyrn.co"> here</Link>!
				</Text>
				<Text>
					For feedback, support, or questions feel free to send an email to
					<Link source="#"> contact@empyrn.co</Link>.
				</Text>
				<Text>
					All of our clock faces are open source! Tap 
					<Link source="https://github.com/EMPYRN"> here</Link> to view or contribute.
				</Text>
				<Text>
					For payment help or inquiries, visit
					<Link source="https://kiezelpay.com/faq"> KiezelPay here</Link>.
				</Text>
			</Section>
		</Page>
	);
}

function getTrialEndsInMessage(props) 
{
	let trialEndDate = props.settings.kpayTrialEndDate;
	let trialDuration = trialEndDate ? trialEndDate - new Date().getTime() : 0;

	if (!trialEndDate) 
	{
		//there has not been any contact with the server yet, so trail time left is unknown
		return "Unlicensed product. Trial period in progress.";
	}

	if (trialDuration > 0) 
	{
		return `Unlicensed product. Trial ends in ${getFuzzyDuration(trialDuration)}`;
	}

	// Returned in the case where the user ended the trial early,
	// and while in this condition, the trial period also ended.
	return "Unlicensed product. Trial period ended.";
}


function getFuzzyDuration(durationInMilliseconds) 
{
	//get duration in minutes, rounded up
	let durationInMinutes = Math.ceil(durationInMilliseconds / 60000.0);
	let numberOfHours = Math.floor(durationInMinutes / 60);
	let numberOfMinutes = durationInMinutes - (numberOfHours * 60);

	let fuzzyDuration = "";

	if (numberOfHours > 0) 
	{
		fuzzyDuration = numberOfHours + " hrs, ";
	}

	return fuzzyDuration + numberOfMinutes + " min.";
}

registerSettingsPage(mySettings);