process.env.DEPLOYENV="dev";
let lambda = require("../index.js");

// let event= {
// 	"address":"346 panorama avenue bathurst",
// };

let event= {
	"address":"39 mayfield road oberon",
};

// let event= {
// 	"address":"34 mayfield road oberon",
// };

// let event= {
// 	"address":'346 #$%^',
// };

// let event= {
// 	"address":"1 onslow",
// };

let context = {};
let callback = console.log;

lambda.handler(event, context, callback);
