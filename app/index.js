import * as focusClock from "./focus-clock";

/**** BEGIN KPAY IMPORTS ****/
import * as kpay from './kpay/release/kpay.js';
import * as kpay_common from '../common/kpay/kpay_common.js';
import './kpay/release/kpay_filetransfer.js';
import './kpay/release/kpay_dialogs.js';
import './kpay/release/kpay_time_trial.js';		
/**** END KPAY IMPORTS ****/

focusClock;

/**** KPAY INIT - REQUIRED ***/
kpay.initialize();