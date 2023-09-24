module.exports = {
	"case1": {
		"description": "Case 1 - Searching with a simple full address returns a single result",
		"type": "compareResults",
		"query": {
			"address": "346 Panorama Avenue Bathurst"
		},
		response1: {
			"data": {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [ 149.7877314258029, -33.62593407349641, 0 ]
					},
					"properties": {
						"address": "39 MAYFIELD ROAD OBERON"
					}
				}]
			}
		},
		response2: {
			data: {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": null,
					"properties": {
						"districtname": "BATHURST"
					}
				}]
			}
		},
		response3: {
			data: {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": null,
					"properties": {
						"suburbname": "OBERON"
					}
				}]
			}
		},
		"lambdaResponse": {
			"data": {
				"address": "39 MAYFIELD ROAD OBERON",
				"location": [ 149.7877314258029, -33.62593407349641 ],
				"suburbName": "OBERON",
				"stateElectoralDistrictName": "BATHURST"
			},
			"error": []
		}
	},
	"case2": {
		"description": "Case 2 - Address not found",
		"type": "compareResults",
		"query": {
			"address": "34 mayfield road oberon",
		},
		response1: {
			"data": {
				"type": "FeatureCollection",
				"features": []
			}
		},
		"lambdaResponse": {
			data: {
				address: '',
				location: [],
				suburbName: '',
				stateElectoralDistrictName: ''
			},
			error: [{ code: 404, message: 'Address Not found', details: ['Address Not found'] }]
		}
	},
	"case3": {
		"description": "Case 3 - Coordinate request rejects",
		"type": "error",
		"query": {
			"address": "346 panorama avenue bathurst",
		},
		response1: {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'content-type': 'text/html;charset=utf-8',
				'content-length': '922',
				connection: 'close',
				date: 'Sat, 23 Sep 2023 05:53:46 GMT',
				'cache-control': 'private',
				server: 'Microsoft-IIS/10.0',
				'x-aspnet-version': '4.0.30319',
				'x-powered-by': 'ASP.NET',
				'x-cache': 'Error from cloudfront',
				via: '1.1 efb8a232eeb70ecdf19fbd8538dcbf5e.cloudfront.net (CloudFront)',
				'x-amz-cf-pop': 'MEL52-P2',
				'x-amz-cf-id': 'nklX8iNaPvILSN_OZdmscmtdcOljts6gAkV3XzOfRuqkYeJ9U69x7g=='
			}
		},
		"lambdaResponse": {
			status: 400,
			statusText: 'Bad Request',
			headers: {
				'content-type': 'text/html;charset=utf-8',
				'content-length': '922',
				connection: 'close',
				date: 'Sat, 23 Sep 2023 05:53:46 GMT',
				'cache-control': 'private',
				server: 'Microsoft-IIS/10.0',
				'x-aspnet-version': '4.0.30319',
				'x-powered-by': 'ASP.NET',
				'x-cache': 'Error from cloudfront',
				via: '1.1 efb8a232eeb70ecdf19fbd8538dcbf5e.cloudfront.net (CloudFront)',
				'x-amz-cf-pop': 'MEL52-P2',
				'x-amz-cf-id': 'nklX8iNaPvILSN_OZdmscmtdcOljts6gAkV3XzOfRuqkYeJ9U69x7g=='
			}
		}
	},
	"case4": {
		"description": "Case 4 - DistrictName not found",
		"type": "compareResults",
		"query": {
			"address":"346 panorama avenue bathurst",
		},
		response1: {
			"data": {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [ 149.56705027261992, -33.42968429289573, 0 ]
					},
					"properties": {
						"address": "346 PANORAMA AVENUE BATHURST"
					}
				}]
			}
		},
		response2: {
			data: {
				"type": "FeatureCollection",
				"features": []
			}
		},
		response3: {
			data: {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": null,
					"properties": {
						"suburbname": "BATHURST"
					}
				}]
			}
		},
		"lambdaResponse": {
			"data": {
				"address": "346 PANORAMA AVENUE BATHURST",
				"location": [ 149.56705027261992, -33.42968429289573 ],
				"suburbName": "BATHURST",
				"stateElectoralDistrictName": ""
			},
			"error": [{
				"code": 404,
				"details": ["stateElectoralDistrictName Not Found"],
				"message": "stateElectoralDistrictName Not Found"
			}]
		}
	},
	"case5": {
		"description": "Case 5 - suburbName not found",
		"type": "compareResults",
		"query": {
			"address":"346 panorama avenue bathurst",
		},
		response1: {
			"data": {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [ 149.56705027261992, -33.42968429289573, 0 ]
					},
					"properties": {
						"address": "346 PANORAMA AVENUE BATHURST"
					}
				}]
			}
		},
		response2: {
			data: {
				"type": "FeatureCollection",
				"features": [{
					"type": "Feature",
					"geometry": null,
					"properties": {
						"districtname": "BATHURST"
					}
				}]
			}
		},
		response3: {
			data: {
				"type": "FeatureCollection",
				"features": []
			}
		},
		"lambdaResponse": {
			"data": {
				"address": "346 PANORAMA AVENUE BATHURST",
				"location": [ 149.56705027261992, -33.42968429289573 ],
				"suburbName": "",
				"stateElectoralDistrictName": "BATHURST"
			},
			"error": [{
				"code": 404,
				"details": ["suburbName Not Found"],
				"message": "suburbName Not Found"
			}]
		}
	}
};
