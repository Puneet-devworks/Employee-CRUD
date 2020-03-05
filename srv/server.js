/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */

"use strict";
const https = require("https");
const port = process.env.PORT || 3000;
const server = require("http").createServer();
const bodyParser = require("body-parser");
const cds = require("@sap/cds");
//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");

https.globalAgent.options.ca= xsenv.loadCertificates(); 	

global.__base = __dirname + "/";
var init = require(global.__base + "utils/initialize");

//Initialize Express App for XSA UAA and HDBEXT Middleware
var app = init.initExpress();

// var hanaOptions = xsenv.getServices({
// 	hana: {
// 		plan: "hdi-shared"
// 	}
// });

// hanaOptions.hana.pooling = true;

//CDS OData V4 Handler
var options = {
	kind: "hana",
	logLevel: "error"
};

//Use Auto Lookup in CDS 2.10.3 and higher
/*Object.assign(options, hanaOptions.hana, {
	driver: options.driver
});*/

cds.connect(options);
var odataURL = "/odata/v4/opensap.hana.CatalogService/";
// Main app
cds.serve("gen/csn.json", {
		crashOnError: false
	})
	.at(odataURL)
	.in(app)
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});

// Redirect any to service root
app.get("/", (req, res) => {
	res.redirect(odataURL);
});

//Setup Additonal Node.js Routes
var router = require("./router")(app, server);

//Start the Server 
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});