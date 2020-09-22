import { me } from "companion"
import * as messaging from 'messaging';
import { settingsStorage } from "settings";

/**** BEGIN KPAY IMPORTS - REQUIRED ****/
import * as kpay from './kpay/release/kpay_companion.js';
import * as kpay_common from '../common/kpay/kpay_common.js';
/**** END KPAY IMPORTS ****/


// Use the block below to handle certain KP events in the companion.
// You can use these events to change visual representations in the settings page,
// but remember this status can potentially be tampered with because all security checks
// happen on the watch only!
// So only unlock premium features for real when the watch also agrees the status is Licensed!

// default implementation below will display trial duration in the settings page and allow users
// to end the trial earlier and pay for your app from within the settings page

/********  BEGIN KPAY SHOW TRIAL STATUS IN SETTINGS - CAN BE REMOVED IF YOU DO NOT WANT THIS FEATURE  ********/
/********  Special thanks to James Bernsen for sharing this code  ********/
function trialActive() 
{
	let trialEndDate = settingsStorage.getItem('kpayTrialEndDate');
	return trialEndDate && (JSON.parse(trialEndDate) > new Date().getTime());
}

kpay.setEventHandler((e, data) => {
	switch (e) 
	{
		case kpay_common.eventTypes.TrialStarted:
			settingsStorage.setItem('kpayTrialEndDate', data.getTime());
			settingsStorage.setItem('btnEndTrialVisible', true);
			settingsStorage.setItem('kpayStatus', 'trial');   //actual message is generated in settings page
			break;

		case kpay_common.eventTypes.TrialEnded:
			settingsStorage.setItem('btnEndTrialVisible', false);
			settingsStorage.setItem('kpayStatus', `Unlicensed product. Trial period ended.`);
			break;

		case kpay_common.eventTypes.CodeAvailable:
			break;

		case kpay_common.eventTypes.PurchaseStarted:
			settingsStorage.setItem('btnEndTrialVisible', trialActive());
			settingsStorage.setItem('kpayStatus', `To continue using Focus, please visit www.kzl.io/empyrn-focus and enter this code: ${data}`);
			break;

		case kpay_common.eventTypes.Licensed:
			settingsStorage.setItem('btnEndTrialVisible', false);
			settingsStorage.setItem('kpayStatus', `Licensed product. Thank you for your support!`);
			break;

		default:
			break;
	};
});


function handleKPayPurchaseSettingChange(newValue) 
{
	if (newValue)
	{
		settingsStorage.setItem('btnEndTrialVisible', trialActive());
		kpay.startPurchase();
	} 
	else if (trialActive())
	{
		settingsStorage.setItem('kpayStatus', 'trial');   //actual message is generated in settings page
		kpay.cancelPurchase();
	}
}

settingsStorage.addEventListener('change', evt => {
	if (evt.key == 'kpayPurchase')
	{
		handleKPayPurchaseSettingChange(JSON.parse(evt.newValue));
	}
});

/********  END KPAY SHOW TRIAL STATUS IN SETTINGS - CAN BE REMOVED IF YOU DO NOT WANT THIS FEATURE  ********/

/**** KPAY INIT - REQUIRED ***/
kpay.initialize();