/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var bodyParser = require("body-parser");

module.exports = function() {
	var app = express.Router();
	app.use(bodyParser.json());
	const xsenv = require("@sap/xsenv");
	let hanaOptions = xsenv.getServices({
		hana: {
			plan: "hdi-shared"
		}
	});
	var hanaConfig = { 
		host : hanaOptions.hana.host, 
		port : hanaOptions.hana.port, 
		user : hanaOptions.hana.user, 
		password : hanaOptions.hana.password 
	}; 
	//to insert an employee based on ID
	app.post("/:ID/:Name/:EmpCode/:Salary/:Country", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var emp = req.params;
		hdbext.createConnection(hanaConfig, function(error, client) { 
		if (error) { 
    		return console.error(error); 
		} 
		client.exec('UPDATE "SAMPLECRUDPOC_SAMPLECRUDPOC_DB_HDI_CONTAINER"."MY_EMPLOYEE_EMPHEADER" SET Name = ?, EmpCode = ?, Salary = ?, Country = ? WHERE ID = ?',[req.params.Name, req.params.EmpCode, req.params.Salary, req.params.Country, req.params.ID], (err, result) => 
							{
									if (err) {
												return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
												} else {
													return res.type("application/json").sendStatus(200).send("Updated Successfully");
														}
							}); 
		});	
	});

	
	return app;
};