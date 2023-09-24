# Assessment-Task

/********************************************************************************************************

Title: Assessment Task - NodeJS Lambda Function for Address Lookup
Author: Annette McArdle
Date: 22/09/2023
Input: JSON Object, eg: {"address":"39 mayfield road oberon"}
Output: JSON Object, eg:
    {
        data: {
            address: '39 MAYFIELD ROAD OBERON',
            location: [ 149.7877314258029, -33.62593407349641 ],
            suburbName: 'OBERON',
            stateElectoralDistrictName: 'BATHURST'
        },
        error: []
    }
Description: Lambda function, that takes an address, fetches the coordinates from NSW_Geocoded_Addressing_Theme
    then, using those coordinates makes 2 parallel requests,
        one to NSW_Administrative_Boundaries_Theme/FeatureServer/4 to fetch the district name
        the other, to NSW_Administrative_Boundaries_Theme/FeatureServer/2 to fetch the suburb
    if no address is found, the promise resolves with a 200 status, but the response contains a message relaying that no address was found.
    if the inital request to fetch coordinates fails, the promise rejects, and error message is returned. No subsequent requests are possible.
    if the coordinates are fetched, but one of the subsequent requests fails, the promise resolves, a 200 status is returned with data that was able
        to be obtained and an error message for the data that could not be fetched is also returned
*****************************************************************************************************/

# Install

Prerequisites: NodeJS 18.x or higher
Install: npm install

# Run Tests

Run local integration test: node test/local.js
Run eslint: npm run pretest