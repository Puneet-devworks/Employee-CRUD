/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	app.get("/", (req, res) => {
		return res.type("text/plain").status(200).send("Hello World Node.js");
	});

	app.get("/env", (req, res) => {
		return res.type("application/json").status(200).send(JSON.stringify(process.env));
	});

	app.get("/userinfo", function(req, res) {
		let xssec = require("@sap/xssec");
		let xsenv = require("@sap/xsenv");
		let accessToken;
		let authWriteScope = false;
		let authReadScope = false;
		let controllerAdminScope = true;
		let userInfo = {
			"name": req.user.id,
			"familyName": req.user.name.familyName,
			"emails": req.user.emails,
			"scopes": [],
			"identity-zone": req.authInfo.identityZone
		};
		accessToken = require(global.__base + "utils/auth").getAccessToken(req);
		userInfo.accessToken = accessToken;
		var b64string = accessToken;
		var buf = Buffer.from(b64string, "base64");
		userInfo.accessTokenDecoded = buf.toString();

		return res.type("application/json").status(200).json(JSON.stringify(userInfo));

	});

	app.get("/info", function(req, res) {
		let xssec = require("@sap/xssec");
		let xsenv = require("@sap/xsenv");
		var info = {};
		info.port = process.env.PORT;
		info.host = process.env.HOST;

		function isCloudFoundryPlatform() {
			try {
				var oAppInfo = JSON.parse(process.env.VCAP_APPLICATION);
				return (!!oAppInfo.cf_api);
			} catch (e) {
				// Not valid JSON -- assume XSA
				return false;
			}
		}
		info.isCloudFoundry = isCloudFoundryPlatform();
		info.applicationName = process.env.VCAP_APPLICATION.application_name;
	//	info.MTAVersion = process.env.MTA_METADATA.version;
		info.uris = process.env.VCAP_APPLICATION.uris;
		info.applicationUris = process.env.VCAP_APPLICATION.application_uris;
		info.spaceId = process.env.VCAP_APPLICATION.space_id;
		info.spaceName = process.env.VCAP_APPLICATION.space_name;
		info.instanceId = process.env.VCAP_APPLICATION.instance_id;
		info.debug = process.env.NODE_ENV !== "production";
		info.apiEndPoint = process.env.API_END_POINT;
		info.caPath = process.env.XS_CACERT_PATH;
		info.secudir = process.env.SECUDIR;
		return res.type("application/json").status(200).json(JSON.stringify(info));
	});

	return app;
};