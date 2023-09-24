"use strict";

const expect = require("expect");
const rewire = require("rewire");
const testData = require("./testData.js");
const app = rewire("../index.js");

// Initialise logging
let origLogFunction = console.log;

describe("AssessmentTask Tests", function() {

	// Iterate through the test cases, execute each one
	Object.keys(testData).forEach(function(key){
		testFactory(testData[key]);
	});

	// Runs before each test, disables logging from the lambda function
	beforeEach(function(){
		// Disable Lambda logging if not running in debug mode
		if(process.env.NODE_ENV !== "debug"){
		// override console.log to supress log output
			console.log = function(){};
		}
	});

});

// Generic function to execute a given test case
function testFactory(testCase){
	it(testCase.description, function(done){
		let event = {};
		Object.keys(testCase.query).forEach(function(key){
			event[key] = testCase.query[key];
		});

		let axiosMock = {
			request: function(config){
				return new Promise(function(resolve, reject){
					// depending on url of request, Check if response is of type Error. If so reject the promise, otherwise resolve it
					switch(config.url) {
						case "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?":
							testCase.type == "error" ? reject(testCase.response1) : resolve(testCase.response1);
							break;
						case "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query?":
							testCase.type == "error" ? reject(testCase.response2) : resolve(testCase.response2);
							break;
						case "https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query?":
							testCase.type == "error" ? reject(testCase.response3) : resolve(testCase.response3);
							break;
						default:
							reject();
					}
				});
			}
		};

		app.__set__("axios.request", axiosMock.request);

		app.handler(event, {}, function(err, result) {
			//Reset logger to show assertion output
			console.log = origLogFunction;
			// Do assertions
			try {
				// Perform assertions based on the test type
				if (testCase.type == "error"){
					// Check for error - expected to exist & be a string with the expected value
					expect(err).toExist().toEqual(testCase.lambdaResponse);
				} else if (testCase.type == "compareResults") {
					//normal result path
					if (result) {
						expect(err).toNotExist();
						//response is an object when no callback, string when callback is included
						expect(result).toEqual(testCase.lambdaResponse);
					}
					else {
						//to catch if response from predictiveUtility is not an array
						expect(err).toExist();
						expect(err).toBeA("string").toEqual(testCase.lambdaResponse);
					}
				}
				done();
			// catch assertion errors
			} catch (error) {
				done(error);
			}
		});
	});
}
