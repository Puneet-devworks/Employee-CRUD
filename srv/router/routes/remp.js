/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();
	let client = require("@sap/hana-client");
	const xsenv = require("@sap/xsenv");
	let hanaOptions = xsenv.getServices({
		hana: {
			plan: "hdi-shared"
		}
	});
	let conn = client.createConnection();
	var connParams = {
		serverNode: hanaOptions.hana.host + ":" + hanaOptions.hana.port,
		uid: hanaOptions.hana.user,
		pwd: hanaOptions.hana.password
	};

	app.get("/all", (req, res) => {
/*		var scope = `${req.authInfo.xsappname}.Display`;
		if (req.authInfo && !req.authInfo.checkScope(scope)) {
			return res.type("text/plain").status(403).send("Forbidden");
		}*/
		conn.connect(connParams, (err) => {
			if (err) {
				return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
			} else {
				conn.exec('select * from "SAMPLECRUDPOC_SAMPLECRUDPOC_DB_HDI_CONTAINER"."MY_EMPLOYEE_EMPHEADER"', (err, result) => {
					if (err) {
						return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
					} else {
						console.log(JSON.stringify(result));
						conn.disconnect();
						return res.type("application/json").status(200).send(result);
						}
				});
			}
		return null;
		});
	});
	
	app.get("/:id", (req, res) => {
		conn.connect(connParams, (err) => {
			if (err) {
				return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
			} else {
				conn.exec('select * from "SAMPLECRUDPOC_SAMPLECRUDPOC_DB_HDI_CONTAINER"."MY_EMPLOYEE_EMPHEADER" where ID = ?', (err, result) => {
					if (err) {
						return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
					} else {
						console.log(JSON.stringify(result));
						conn.disconnect();
						return res.type("application/json").status(200).send(result);
						}
				});
			}
		return null;
		});
	});
	
	return app;
};