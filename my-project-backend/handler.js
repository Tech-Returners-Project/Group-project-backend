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
        let score = 0;

        if (query.Location.toLowerCase() === activity.Location.toLowerCase()) {
          score++
        }
        if (query.Place.toLowerCase() === activity.Place.toLowerCase()) {
          score++
        }
        if (query.People.toLowerCase() === activity.People.toLowerCase()) {
          score++
        }
        if (query.Price.toLowerCase() === activity.Price.toLowerCase()) {
          score++
        }
        if (query.Activity_Level.toLowerCase() === activity.Activity_Level.toLowerCase()) {
          score++
        }
        activity.score = score
        return (activity)
      })

      let highestScoringItem = data[0];

      for (let i = 0; i < data.length; i++) {
        if (data[i].score > highestScoringItem.score) {
          highestScoringItem = data[i];
        }
      }

      response.status(200).json({
        highestScoringItem
      })
    }
  });
});

module.exports.app = serverlessHttp(app);