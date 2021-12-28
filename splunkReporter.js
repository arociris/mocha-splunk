const lib = require('./lib/utils');
const https = require('https');
const Mocha = require('mocha');
const {
    EVENT_RUN_BEGIN,
    EVENT_TEST_PASS,
    EVENT_TEST_FAIL,
    EVENT_HOOK_END
} = Mocha.Runner.constants;

const splunk = function (runner, options) {
    if (options.reporterOptions) {
        lib.setOptions(options.reporterOptions)
    }
    lib.logDebug("Reporter Options are :" + JSON.stringify(options));
    runner
        .once(EVENT_RUN_BEGIN, () => {
            lib.logDebug('start');
        })
        .on(EVENT_TEST_PASS, test => {
            const data_to_dispatch = lib.prepareMessage(test);
            lib.data_dispatcher(data_to_dispatch);
        })
        .on(EVENT_TEST_FAIL, (test, err) => {
            const data_to_dispatch = lib.prepareMessage(test, err);
            lib.data_dispatcher(data_to_dispatch);
        })
        .on(EVENT_HOOK_END, (test, err) => {
            const data_to_dispatch = lib.prepareMessage(test, err);
            lib.data_dispatcher(data_to_dispatch);
        })


}
module.exports = splunk;
