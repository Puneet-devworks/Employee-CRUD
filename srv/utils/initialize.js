/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";
module.exports = {
initExpress: function() {
		var xsenv = require("@sap/xsenv");
		var xssec = require("@sap/xssec");
		var xsHDBConn = require("@sap/hdbext");
		var express = require("express");

		//Initialize Express App for HDBEXT Middleware
		var app = express();
		var hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		app.use(
			xsHDBConn.middleware(hanaOptions.hana)
		);
		return app;
	}
};