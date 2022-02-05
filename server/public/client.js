$(document).ready(onReady);

function onReady(){
    $('#calcContainer').on('click', '.buttons', addMath);
    $('#calcContainer').one('click', '.operators', addOperator);
    $('#clearBtn').on('click', clearMath);
    $('#equalsBtn').on('click', validateInput);
    $('#deleteBtn').on('click', clearHistory);
    // $('#historyList').on('click', '.historyItem', selectHistory);
    $('#historyList').on('click', '.deleteHistBtn', deleteHistoryEvent);
    $('#historyList').on('click', '.recallHistory', recallExpression)
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
        $('#historyList').append(`
        <li class="historyItem" id="${i}" data-id(${arr[i].expression})>
        ${arr[i].num1} ${arr[i].operator} ${arr[i].num2} = ${arr[i].result}  
        <button class="recallHistory">Recalculate Expression</button>
        <button class="deleteHistBtn">Delete Expression</button></li>`)
    }
}
    
    // for (calc of arr) {
    //     $('#historyList').append(`<li>
    //     ${calc.num1} ${calc.operator} ${calc.num2} = ${calc.result}
    //     </li>`)
    // }


function clearHistory() {
    $('#theResults').empty();
    $.ajax({
        method: 'DELETE',
        url: '/calcHistory'
    }).then(function(response){
        resultHistory();
    }).catch(function(response){
        console.log('Failed to clear history');
    })
}

function recallExpression() {
    let id = $(this).closest('li').data('exp');
    console.log(this);
    console.log(id);
    
}

function deleteHistoryEvent() {
    let id = $(this).parent().attr('id');
    $(this).parent().parent().remove();
    $.ajax({
        method: 'DELETE',
        url: '/removeExp',
        data: {
            index: id
            }
    }).then(function(response){
        
    }).catch(function(response){
        console.log('Failed to delete expression');
    })
    resultHistory();
}
