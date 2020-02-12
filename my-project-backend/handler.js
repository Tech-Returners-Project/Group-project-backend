const express = require("express");
const cors = require("cors");
const serverlessHttp = require("serverless-http");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/activities", function (request, response) {

  response.status(200).json({
    activities: [
      {
        Location: 'Manchester',
        Place: 'outdoor'
      }
    ]
  });
});

module.exports.app = serverlessHttp(app);