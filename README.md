# mocha-splunk

This is a reporter for Mocha to log test results to Splunk. 

**Installation**  
    To install run `npm install mocha-splunk`

**Usage**  
This reporter will log below mentioned information to splunk
1. Test run number
2. Git branch
3. Test duration
4. Test title
5. Test result
6. Additional debug information
To use this in your Mocha tests, update your run command to use Mocha-Splunk reporter as below:
`mocha --reporter mocha-splunk --reporter-options <options> testfiles.js`
 
 To use the reporter, below is list of reporter options that needs to be setup

| Option | Required |Description |
|--|--|--|
|  run_no | No| Test run number / build number|
|  test_env| No| Test environment e.g. QA/UAT |
|  git_branch| No| Git branch under test|
|  splunk_host| Yes | Splunk host name e.g. splunk.com:8088|
|  splunk_url| No| URL for event collector e.g. /services/collector|
|  splunk_token| Yes | Splunk HTTP token|
|  debug| No| print debug information from the reporter |
|  useProcessVar|No| Whether to read options from environment variables|

Make sure to providing values mandatory options as outlined in above table to make sure smooth reporting on slack

**Quering splunk**  
In the new search, mention your index and source type as http event. This will list your test results
![image](https://user-images.githubusercontent.com/31276396/147637937-a963e85e-3aa2-494d-953c-697f548fb93d.png)
