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

        if (query.answer[0] === activity.Location) {
          score++
        }
        if (query.answer[1] === activity.Place) {
          score++
        }
        if (query.answer[2] === activity.People) {
          score++
        }
        if (query.answer[3] === activity.Price) {
          score++
        }
        if (query.answer[4] === activity.Activity_Level) {
          score++
        }
        activity.score = score
        return (activity)
      })

      let highestScoringItem = data[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i].score > highestScoringItem) {
          highestScoringItem = data[i]
        }
      }
    }
    response.status(200).json({
      highestScoringItem
    })
  });
});

module.exports.app = serverlessHttp(app);