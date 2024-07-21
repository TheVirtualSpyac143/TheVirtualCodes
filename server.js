const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

let votes = { option1: 0, option2: 0 };
let voterIPs = new Set();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.post('/vote', (req, res) => {
    const { option } = req.body;
    const userIP = req.ip;

    if (voterIPs.has(userIP)) {
        return res.status(400).json({ message: 'You have already voted!' });
    }

    if (option === 'option1' || option === 'option2') {
        votes[option]++;
        voterIPs.add(userIP);
        return res.json({ message: `Thank you for voting for ${option}` });
    }

    res.status(400).json({ message: 'Invalid option' });
});

app.get('/results', (req, res) => {
    res.json(votes);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Serve the HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
