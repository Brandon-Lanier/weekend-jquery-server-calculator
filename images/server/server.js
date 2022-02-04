const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));\










//Always at bottom

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});