require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {

    console.log(req.body);
    mailchimp.setConfig({
        apiKey: process.env.API_KEY,
        server: 'us7',
    });

    async function callPing() {
        const response = await mailchimp.ping.get();
        console.log(response);
    }

    callPing();

    res.sendFile(__dirname + '/success.html');
});

app.listen(3000, function (err) {
    if (err) {
        console.log('Error Running Server');
        return;
    }

    console.log('Server is Up and running !');
});
