const axios = require('axios');

exports.handler = function (event, context, callback) {
	console.log("Assignment Event: ", event);

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

	// console.log("URL", config.url);
	// console.log("Params: ", config.params);

	let toReturn = {
		data: {
			address: '',
			location: [],
			suburbName: '',
			stateElectoralDistrictName: ''
		},
		error: []
	}
	axios.request(config)
		.then((response) => {

			// console.log("Query1 Response: ", JSON.stringify(response.data.features));
			// console.log("Query1 Response Length: ", response.data.features.length);

			if (response.data.features.length > 0) {
				// console.log("Coordinates: ", response.data.features[0].geometry.coordinates.join());
				toReturn.data.address = response.data.features[0].properties.address;
				toReturn.data.location.push(response.data.features[0].geometry.coordinates[0]);
				toReturn.data.location.push(response.data.features[0].geometry.coordinates[1]);

				let promiseArray = [];

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

				let promise2 = axios.request(config2)
					.then((response2) => {
						console.log("Query2: ", JSON.stringify(response2.data));
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

				let promise3 = axios.request(config3)
					.then((response3) => {
						console.log("Query3: ", JSON.stringify(response3.data));
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

				Promise.allSettled(promiseArray).then((results) => {
					// console.log("Results: ", JSON.stringify(results));
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
