# Assessment-Task

/********************************************************************************************************  
  
Title: Assessment Task - NodeJS Lambda Function for Address Lookup  
Author: Annette McArdle  
Date: 22/09/2023  
Input: JSON Object, eg: {"address":"39 mayfield road oberon"}  
Output: JSON Object, eg:  
&emsp;{  
&emsp;&emsp;data: {  
&emsp;&emsp;&emsp;address: '39 MAYFIELD ROAD OBERON',  
&emsp;&emsp;&emsp;location: [ 149.7877314258029, -33.62593407349641 ],  
&emsp;&emsp;&emsp;suburbName: 'OBERON',  
&emsp;&emsp;&emsp;stateElectoralDistrictName: 'BATHURST'  
&emsp;&emsp;},  
&emsp;&emsp;error: []  
&emsp;}  
Description: Lambda function, that takes an address, fetches the coordinates from NSW_Geocoded_Addressing_Theme  
&emsp;then, using those coordinates makes 2 parallel requests,  
&emsp;&emsp;one to NSW_Administrative_Boundaries_Theme/FeatureServer/4 to fetch the district name  
&emsp;&emsp;the other, to NSW_Administrative_Boundaries_Theme/FeatureServer/2 to fetch the suburb  
&emsp;if no address is found, the promise resolves with a 200 status, but the response contains a message relaying that no address was found.  
&emsp;if the inital request to fetch coordinates fails, the promise rejects, and error message is returned. No subsequent requests are possible.  
&emsp;if the coordinates are fetched, but one of the subsequent requests fails, the promise resolves, a 200 status is returned with data that was able  
&emsp;&emsp;to be obtained and an error message for the data that could not be fetched is also returned  
*****************************************************************************************************/  
  
## Install  
  
Prerequisites: NodeJS 18.x or higher  
Install: npm install  
  
## Run Tests  
  
Run local integration test. several examples of events available: node test/local.js  
Run eslint: npm run pretest
Run Unit Tests with eslint (reduced logging): npm run test
Run Unit Tests with full logging: npm run debug
