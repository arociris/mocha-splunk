const https = require('https');

const setOptions = (options) => {
    this.run_identifier = options.useProcessVar && process.env.run_no?process.env.run_no:options.run;
    this.test_env = options.useProcessVar && process.env.test_env? process.env.test_env :options.test_env;
    this.git_branch = options.useProcessVar && process.env.git_branch? process.env.git_branch::(options.git_branch?options.git_branch:'local_run');
    this.splunk_host = options.useProcessVar && process.env.splunk_host? process.env.splunk_host:options.splunk_host;
    this.splunk_url = options.useProcessVar && process.env.splunk_url? process.env.splunk_url:(options.splunk_url?options.splunk_url:'/services/collector');
    this.splunk_token = options.useProcessVar && process.env.splunk_token? process.env.splunk_token:options.splunk_token;
    this.debug = options.debug
}

const prepareMessage = (test, err) => {
    return {
        title: test.title,
        full_title: test.fullTitle(),
        result: test.state,
        debug_data: test.splunkContext ? test.splunkContext : undefined,
        error: err ? err.message : undefined,
        test_duration: test.duration
    }
}

const logDebug = (message) => {
    if (this.debug)
        console.log(`Mocha Splunk Reporter: ${message}`)
}

const data_dispatcher = (data_to_send) => {
    try{
        const data = new TextEncoder().encode(
            JSON.stringify({
                "event": {
                    test_run: this.run_identifier, test_environment: this.test_env,
                    test_details: data_to_send, git_branch: this.git_branch
                }
            }))

        const options = {
            hostname: this.splunk_host.split(':')[0],
            port: this.splunk_host.split(':')[1],
            path: this.splunk_url.trim(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Splunk ${this.splunk_token.trim()}`
            }
        };

        logDebug(JSON.stringify(options,null,2));
        const req = https.request(options, res => {
            logDebug(`statusCode: ${res.statusCode}`);
            if (res.statusCode != 200) {
                logDebug(`response statusCode from Splunk: ${res.statusCode}`);
                res.on('data', d => {
                    logDebug(d);
                })
            }
        });

        req.on('error', error => {
            console.error(`Mocha Splunk Reporter: ${error}`)
        });
        req.write(data);
        req.end();}
    catch (e) {
        console.error("Mocha Splunk Reporter: got exception \n"+e)
    }
}

module.exports = {
    setOptions,
    prepareMessage,
    logDebug,
    data_dispatcher
}
