require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {

    console.log(req.body);

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                statusCode: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    var jdata = JSON.stringify(data);

    var options = {
        url: `https://us7.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`,
        method: 'POST',
        headers: {
            'Authorization': 'ridsuteri ' + process.env.API_KEY
        },
        body: jdata
    }

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            res.sendFile(__dirname + '/failure.html');
        } else {
            console.log(response.statusCode);
            if (response.statusCode == '200') {
                res.sendFile(__dirname + '/success.html');
            }
            else {
                res.sendFile(__dirname + '/failure.html');
            }

        }
    });
    // _________to check connection with mail chimp____________

    // mailchimp.setConfig({
    //     apiKey: process.env.API_KEY,
    //     server: 'us7',
    // });

    // async function callPing() {
    //     const response = await mailchimp.ping.get();
    //     console.log(response);
    // }

    // callPing();

});

// for routing the failure to home page
app.post('/failure', function (req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log('Error Running Server');
        return;
    }

    console.log('Server is Up and running !');
});
