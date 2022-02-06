$(document).ready(onReady);

function onReady(){
    $('#calcContainer').on('click', '.buttons', addMath);
    // $('#calcContainer').one('click', '.operators', addOperator)
    $('#clearBtn').on('click', clearMath);
    $('#equalsBtn').on('click', validateInput);
    $('#eraserImg').on('click', clearHistory);
    // $('#historyList').on('click', '.historyItem', selectHistory);
    $('#historyList').on('click', '.fa-eraser', deleteHistoryEvent);
    $('#historyList').on('click', '.historyItem', getExpression)
    getHistory();
    getResult();
    allowOneOperator();
}

function addMath() {
    $("#inputField").val($("#inputField").val() + $(this).text());
}

function addOperator() {
    $("#inputField").val($("#inputField").val() + $(this).text());
}

function clearMath() {
    $("#inputField").val('');
    $('#theResults').empty();
    allowOneOperator();
}

function allowOneOperator() {
    $('#calcContainer').one('click', '.operators', addOperator)
}

function validateInput() {
    $("#theResults").empty();
    let el = $("#inputField").val()
    let last = el.length - 1;
    if (el === '') {
        $("#theResults").text('Please Enter Some Digits')
    } else if (el.charAt(0) === '+' || el.charAt(0) === '-' || el.charAt(0) === '*' || el.charAt(0) === '/') {
        $("#theResults").text('Invalid Expression');
        $("#inputField").val('');
        allowOneOperator();
    } else if (el.charAt(last) === '+' || el.charAt(last) === '-' || el.charAt(last) === '*' || el.charAt(last) === '/') {
        $("#theResults").text('Invalid Expression');
        $("#inputField").val('');
        allowOneOperator();
    } else if (el.includes('+') || el.includes('-') || el.includes('*') || el.includes('/')) {
        calculate();
    } else {
        $("#theResults").text('Invalid Expression');
        $("#inputField").val('');
        // allowOneOperator();
    }
}

function calculate() {
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: {
            expression: {
            input: $('#inputField').val()
            }
        }
    }).then(function(response){
        getResult();
        // resultHistory(); 
    })
    $("#inputField").val('')
    $('#calcContainer').one('click', '.operators', addOperator);
    }

function getResult() {
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function(response){
        renderResult(response);
    })
}

function renderResult(res) {
    $('#theResults').empty();
    $('#theResults').append(res[0].result);
    getHistory();
    }


function getHistory() {
    $.ajax({
        method: 'GET',
        url: '/calcHistory'
    }).then(function(response){
        renderHistory(response);
    })
}

function renderHistory(arr) {
    $('#historyList').empty();
    for (let i = 0; i < arr.length; i++) {
        $('#historyList').append(`
        <li class="historyItem" id="${i}">
        ${arr[i].num1} ${arr[i].operator} ${arr[i].num2} = ${arr[i].result}  
        <i class="fas fa-eraser"></i></li>`)
    }
}

function clearHistory() {
    $('#theResults').empty();
    $.ajax({
        method: 'DELETE',
        url: '/calcHistory'
    }).then(function(response){
        getHistory();
    }).catch(function(response){
        console.log('Failed to clear history');
    })
}

function getExpression() {
    let id = $(this).attr('id')
    console.log(id);
    $.ajax({
        method: 'GET',
        url: '/calcHistory',
    }).then(function(response){
        renderExpression(response[id]); 
    })
}

function renderExpression(obj) {
    $('#theResults').empty();
    $('#inputField').val('');
    $('#theResults').append(obj.result);
    $('#inputField').val(obj.expression);
}

function deleteHistoryEvent() {
    $('#theResults').empty();
    let id = $(this).parent().attr('id');
    // $(this).parent().parent().remove();
    $.ajax({
        method: 'DELETE',
        url: '/removeExp',
        data: {
            index: id
            }
    }).then(function(response){
        getHistory();
    }).catch(function(response){
        console.log('Failed to delete expression');
    })
    
}
