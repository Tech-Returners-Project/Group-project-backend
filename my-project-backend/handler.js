const express = require("express");
const cors = require("cors");
const serverlessHttp = require("serverless-http");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "MakeMyDay"
});

app.get("/activities", function (request, response) {
  connection.query("SELECT * FROM Activities", function (err, data) {
    if (err) {
      response.status(500).json({
        error: err
      });
    } else {
      const query = request.query;

      data = data.map(activity => {
        let score = 0

        if (query.Location === activity.Location) {
          score++
        }
        if (query.Place === activity.Place) {
          score++
        }
        if (query.People === activity.People) {
          score++
        }
        if (query.Price === activity.Price) {
          score++
        }
        if (query.Activity_Level === activity.Activity_Level) {
          score++
        }
        activity.score = score
        return (activity)
      })
    }
  });
});

module.exports.app = serverlessHttp(app);