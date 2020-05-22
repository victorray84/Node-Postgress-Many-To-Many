require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  ssl: { rejectUnauthorized: false },
});

client.connect();

client.query("SELECT NOW()", (err, res) => {
  //console.log(err, res);
  //client.end();
});

module.exports = client;
