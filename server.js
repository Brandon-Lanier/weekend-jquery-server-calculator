const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

let calcHistory = require('./server/modules/calcHistory')
let result = 0;

app.use(express.static('./server/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.post('/calculate', function(req, res){
    let expression = req.body.expression.input;
    result = Function('return ' + expression)() 
    let store = {
        expression: expression,
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