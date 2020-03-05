/*eslint-env node, es6 */
"use strict";

module.exports = (app, server) => {
	app.use("/node", require("./routes/node")());
	app.use("/node/read", require("./routes/remp")());
	app.use("/node/create", require("./routes/cemp2")());
	app.use("/node/update", require("./routes/uemp")());
	app.use("/node/delete", require("./routes/demp")());
};