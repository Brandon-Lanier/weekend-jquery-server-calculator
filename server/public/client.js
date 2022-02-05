$(document).ready(onReady);

function onReady(){
    $('#calcContainer').on('click', '.buttons', addMath);
    $('#calcContainer').one('click', '.operators', addOperator);
    $('#clearBtn').on('click', clearMath);
    $('#equalsBtn').on('click', validateInput);
    $('#deleteBtn').on('click', clearHistory);
    $('#historyList').on('click', '.historyItem', selectHistory)
    resultHistory();
}

// Make a function to evaluate the string entered before sending to server

function addMath() {
    $("#inputField").val($("#inputField").val() + $(this).text());
}

function addOperator() {
    $("#inputField").val($("#inputField").val() + $(this).text());
}

function clearMath() {
    $("#inputField").val('');
    $('#calcContainer').one('click', '.operators', addOperator);
}

function validateInput() {
    $("#theResults").empty();
    if ($("#inputField").val() === '') {
        $("#theResults").text('Please Enter Some Digits')
} else {
    calculate();
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
        renderResult(response);
        resultHistory(); 
    })
    $("#inputField").val('')
    $('#calcContainer').one('click', '.operators', addOperator);
    }
}

function renderResult(result) {
    $('#theResults').empty();
    $('#theResults').append(result);
}

function resultHistory() {
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
        $('#historyList').append(`<li class="historyItem" data-id="${[i]}">
        ${arr[i].num1} ${arr[i].operator} ${arr[i].num2} = ${arr[i].result}  <button class="recalHistory">Recalculate Expression</button><button class="deleteHistBtn">Delete Expression</button></li>`)
    }
}
    
    // for (calc of arr) {
    //     $('#historyList').append(`<li>
    //     ${calc.num1} ${calc.operator} ${calc.num2} = ${calc.result}
    //     </li>`)
    // }


function clearHistory() {
    $.ajax({
        method: 'DELETE',
        url: '/calcHistory'
    }).then(function(response){
        resultHistory();
        $('#theResults').empty();
    })
}

function selectHistory() {
    let id = $(this).attr('id');
    console.log(this);
    console.log(id);
    
}

function deleteHistoryEvent() {
    $.ajax({
        method: 'DELETE',
        url: '/calcHistory'
    }).then(function(response){
        resultHistory();
        $('#theResults').empty();
    })
}
