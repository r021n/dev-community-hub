const knex = require("knex");
const config = require("../config/knexConfig");

const db = knex(config.development);

module.exports = db;
