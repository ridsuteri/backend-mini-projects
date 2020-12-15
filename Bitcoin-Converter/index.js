const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ba = require("bitcoinaverage");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

var publicKey = "OGVkMWNjOWI1NDJiNDQ2OGFmZmQ0ZGEyOTlhYWMwZTk";
var secretKey =
  "NGRjOTYxNzU1NTM4NDY3ZDgyMWJkYTUyOTNjMjkyYWExZjFhNGVjNzUzY2E0MjJiYWU3MDllYWQ5ZGUxODQyZA";

var restClient = ba.restfulClient(publicKey, secretKey);
var wsClient = ba.websocketClient(publicKey, secretKey);

app.post('/c2f', function (req, res) {
  var from = req.body.crypto;
  var to = req.body.fiat;
  var amount = req.body.amount;
  restClient.performConversionLocal(from, to, amount, function (response) {
    response = JSON.parse(response);
    res.write("<p>TimeStamp " + response.time + "</p>");
    res.write("<H1> The Value of " + amount + " " + from + " is " + response.price + " " + to + "</H1>");
    res.send();
  });
});

app.post('/f2c', function (req, res) {
  var from = req.body.fiat;
  var to = req.body.crypto;
  var amount = req.body.amount;
  restClient.performConversionLocal(from, to, amount, function (response) {
    response = JSON.parse(response);
    res.write("<p>TimeStamp " + response.time + "</p>");
    res.write("<H1> The Value of " + amount + " " + from + " is " + response.price + " " + to + "</H1>");
    res.send();
  });
});

app.listen(3000, function (req, res) {
  console.log("Server is up and running");
});
