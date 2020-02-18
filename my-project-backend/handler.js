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

        Activities = Activities.map(activity => {
          let score = 0

          if (questions[1].Answer === activity.Location) {
            score++
          }
          if (questions[0].Answer === activity.Place) {
            score++
          }
          if (questions[2].Answer === activity.People) {
            score++
          }
          if (questions[3].Answer === activity.Price) {
            score++
          }
          if (questions[4].Answer === activity.Activity_Level) {
            score++
          }
          activity.score = score
          return (activity)
        })
      }

      let highestScoringItem = Activities[0];
      for (let i = 0; i < Activities.length; i++) {
        if (Activities[i].score > highestScoringItem) {
          highestScoringItem = Activities[i]
        }
      }

      response.status(200).json({
        highestScoringItem
      });
    }
  });
});

module.exports.app = serverlessHttp(app);