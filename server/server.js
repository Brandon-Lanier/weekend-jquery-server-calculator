const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

let calcHistory = require('./modules/calcHistory');
let result = 0;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.post('/calculate', function (req, res) {
    let expression = req.body.expression.input; // Input from user on front end
    let subExp = 0;
    let operator = '';
    if (expression.indexOf('+') !== -1) { // If operator exists in string
        subExp = expression.split('+', 2); // Split string at operator to get an array of both numbers
        result = Number(subExp[0]) + Number(subExp[1]); // Calculate the two numbers
        operator = '+'; // defining the operator for storage in the object
    } else if (expression.indexOf('-') !== -1) {
        subExp = expression.split('-', 2);
        result = Number(subExp[0]) - Number(subExp[1]);
        operator = '-';
    } else if (expression.indexOf('*') !== -1) {
        subExp = expression.split('*', 2);
        result = Number(subExp[0]) * Number(subExp[1]);
        operator = '*';
    } else if (expression.indexOf('/') !== -1) {
        subExp = expression.split('/', 2);
        result = Number(subExp[0]) / Number(subExp[1]);
        operator = '/';
    }
    let store = {
        expression: expression,
        num1: subExp[0],
        num2: subExp[1],
        operator: operator,
        result: result
    }
    calcHistory.unshift(store); //Add the store object to the calcHistory array
    res.sendStatus(201); // All good notification if completed.
})

app.get('/calculate', function (req, res) {
    res.send(calcHistory); //Send back the results from calculate
})

app.get('/calcHistory', function (req, res) {
    res.send(calcHistory); //Sending back full array when needed
})

app.delete('/calcHistory', (req, res) => {
    calcHistory.length = 0; // Sets the array to empty 
    res.sendStatus(201);
})

app.delete('/removeExp', (req, res) => {
    let arryI = req.body.index; // Array index of selected expression in the history list
    calcHistory.splice(arryI, 1); // Remove the selected expression from the array
    res.sendStatus(201);
})

app.listen(process.env.PORT || PORT, () => {
    console.log('listening on port', PORT)
})
