const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

let calcHistory = require('./modules/calcHistory')
let result = 0;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.post('/calculate', function(req, res){
    let expression = req.body.expression.input;
    let subExp = 0;
    let operator = '';
    if (expression.indexOf('+') !== -1) { //
        subExp = expression.split('+', 2)
        result = Number(subExp[0]) + Number(subExp[1]);
        operator = '+';
    } else if (expression.indexOf('-') !== -1) {
        subExp = expression.split('-', 2)
        result = Number(subExp[0]) - Number(subExp[1]);
        operator = '-';
    } else if (expression.indexOf('*') !== -1) {
        subExp = expression.split('*', 2)
        result = Number(subExp[0]) * Number(subExp[1]);
        operator = '*';
    } else if (expression.indexOf('/') !== -1) {
        subExp = expression.split('/', 2)
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
    calcHistory.unshift(store);
    res.json(result);
});


app.get('/calculate', function(req, res) {
    res.send(result);
});

app.get('/calcHistory', function(req, res){
    res.send(calcHistory)
    console.log(calcHistory);
})

// app.delete('/calcHistory', function(req,res){
//     calcHistory = [];
//     res.sendStatus(201)
// })

app.delete('/calcHistory', (req,res) =>{
    calcHistory.length = 0
    res.sendStatus(201);
})






//Always at bottom

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

function parseNumbers() {
    for (char of number) {
        if (char === '') {

        }
    }
}