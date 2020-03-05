/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var bodyParser = require("body-parser");

module.exports = function() {
	var app = express.Router();
	app.use(bodyParser.json());
	
	//to insert an employee based on ID
	app.post("/:ID/:Name/:EmpCode/:Salary/:Country", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var emp = req.params;
		// var inputParams = {Name:emp.Name, EmpCode:emp.EmpCode, Salary:emp.Salary, ID:emp.ID, Country:emp.Country};
		// var _Name = "User007";
		// var _EmpCode = "I390876";
		// var _Salary = 48001;
		// var _ID = 7;
		// var _Country = "India";
		// inputParams = {Name: _Name, EmpCode: _EmpCode, Salary: _Salary, ID: _ID, Country: _Country};
		// {_Name: "CreatedUser", _EmpCode: "I390876", _Salary: 48001, _ID: 7, _Country: "India"}
		//(client, Schema, Procedure, callback)
		hdbext.loadProcedure(client, "SAMPLECRUDPOC_SAMPLECRUDPOC_DB_HDI_CONTAINER", "EmployeeAddOrEdit", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				console.log("load procedure error");
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp({_Name : "User007", _EmpCode : "I390876", _Salary : 48001, _ID : 7, _Country : "India"}, (err, parameters) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					console.log(err);
				}
				else {
				res.type("application/json").status(200).send("Created Successfully");
				console.log("Created Successfully - 1 row added");
				}
			});
		});
	});	

	
	return app;
};