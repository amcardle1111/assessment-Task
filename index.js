/*********************************************************************************************************
 * Title: Assessment Task
 * Author: Annette McArdle
 * Date: 22/09/2023
 * Input: JSON Object, eg: {"address":"39 mayfield road oberon"}
 * Output: JSON Object, eg:
 *      {
 *          data: {
				address: '39 MAYFIELD ROAD OBERON',
				location: [ 149.7877314258029, -33.62593407349641 ],
				suburbName: 'OBERON',
				stateElectoralDistrictName: 'BATHURST'
			},
			error: []
		}
 * Description: Lambda function, that takes an address, fetches the coordinates from NSW_Geocoded_Addressing_Theme
 *              then, using those coordinates makes 2 parallel requests,
 *                    one to NSW_Administrative_Boundaries_Theme/FeatureServer/4 to fetch the district name
 *                    the other, to NSW_Administrative_Boundaries_Theme/FeatureServer/2 to fetch the suburb
 *              if no address is found, the promise resolves with a 200 status, but the response contains a message relaying that no address was found.
 *              if the inital request to fetch coordinates fails, the promise rejects, and error message is returned. No subsequent requests are possible.
 *              if the coordinates are fetched, but one of the subsequent requests fails, the promise resolves, a 200 status is returned with data that was able
 *                 to be obtained and an error message for the data that could not be fetched is also returned
 ********************************************************************************************************/
const axios = require('axios');

exports.handler = function (event, context, callback) {
	console.log("Assignment Event: ", event);

	//creating a return object allows me to control the key order, when suburb and district can return in, and then be added either order
	let toReturn = {
		data: {
			address: '',
			location: [],
			suburbName: '',
			stateElectoralDistrictName: ''
		},
		error: []
	};

	//axios request config to NSW_Geocoded_Addressing_Theme
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?',
		headers: {},
		params: {
			where: 'address=\'' + event.address.toUpperCase() + '\'',
			outSR: 4326,
			outFields: 'address',
			f: 'geojson'
		}
	};

	console.log("Request: ", config.url, "where=",config.params.where);
	axios.request(config)
		.then((response) => {

			if (response.data.features.length > 0) {
				toReturn.data.address = response.data.features[0].properties.address;
				toReturn.data.location.push(response.data.features[0].geometry.coordinates[0]);
				toReturn.data.location.push(response.data.features[0].geometry.coordinates[1]);

				//need a promise array and Promise.AllSettled to ensure the two concurrent requests both finish and the lambda function doesn't return prematurely.
				let promiseArray = [];

				// I use separate configs and response for each request.
				// Config/response relates to fetching coordinates. Config2/response2 relates to the districtname request. Config3/response3 relates to suburb

				let config2 = {
					method: 'get',
					maxBodyLength: Infinity,
					url: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query?',
					params: {
						geometry: response.data.features[0].geometry.coordinates.join(),
						geometryType: 'esriGeometryPoint',
						inSR: 4326,
						spatialRel: 'esriSpatialRelIntersects',
						outFields: 'districtname',
						returnGeometry: false,
						f: 'geojson'
					}
				};

				console.log("Request: ", config2.url, "geometry=",config2.params.geometry, "outFields: ", config2.params.outFields);
				let promise2 = axios.request(config2)
					.then((response2) => {
						if (response2.data.features.length > 0) {
							toReturn.data.stateElectoralDistrictName = response2.data.features[0].properties.districtname;
						}
						else {
							toReturn.error.push({
								code: 404,
								message: 'stateElectoralDistrictName Not Found',
								details: ['stateElectoralDistrictName Not Found']
							});
						}
					})
					.catch((error) => {
						toReturn.error.push(error);
					});
				promiseArray.push(promise2);

				let config3 = {
					method: 'get',
					maxBodyLength: Infinity,
					url: 'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query?',
					params: {
						geometry: response.data.features[0].geometry.coordinates.join(),
						geometryType: 'esriGeometryPoint',
						inSR: 4326,
						spatialRel: 'esriSpatialRelIntersects',
						outFields: 'suburbname',
						returnGeometry: false,
						f: 'geojson'
					}
				};

				console.log("Request: ", config3.url, "geometry=",config3.params.geometry, "outFields: ", config3.params.outFields);
				let promise3 = axios.request(config3)
					.then((response3) => {

						if (response3.data.features.length > 0) {
							toReturn.data.suburbName = response3.data.features[0].properties.suburbname;
						}
						else {
							toReturn.error.push({
								code: 404,
								message: 'suburbName Not Found',
								details: ['suburbName Not Found']
							});
						}

					})
					.catch((error) => {
						console.log(error);
						toReturn.error.push(error);
					});
				promiseArray.push(promise3);

				Promise.allSettled(promiseArray)
					.then(() => {
						callback(null, toReturn);
					})
					.catch((error) => {
						console.log(error);
						callback(null, toReturn);
					});
			} else {
				toReturn.error.push({
					code: 404,
					message: 'Address Not found',
					details: ['Address Not found']
				});
				callback(null, toReturn);
			}
		})
		.catch((error) => {
			console.log(error);
			callback(error);
		});
};
