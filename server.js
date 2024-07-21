const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const port = 3000;

let votes = { option1: 0, option2: 0 };
let voterIPs = new Set();
const votesFilePath = 'votes.txt';

// Ensure the votes file exists
fs.open(votesFilePath, 'a', (err) => {
    if (err) throw err;
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.post('/vote', (req, res) => {
    const { option } = req.body;
    const userIP = req.ip;

    console.log(`Received vote for ${option} from IP: ${userIP}`);  // Logging the vote attempt

    if (voterIPs.has(userIP)) {
        console.log('Vote already cast by this IP');
        return res.status(400).json({ message: 'You have already voted!' });
    }

    if (option === 'option1' || option === 'option2') {
        votes[option]++;
        voterIPs.add(userIP);

        fs.appendFileSync(votesFilePath, `${
