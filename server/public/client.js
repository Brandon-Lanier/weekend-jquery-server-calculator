$(document).ready(onReady);

function onReady(){
    $('#calcContainer').on('click', '.buttons', addMath);
    $('#clearBtn').on('click', clearMath);
    $('#equalsBtn').on('click', calculate);
    $('#deleteBtn').on('click', clearHistory)
    resultHistory()
}

function addMath() {
    // if ($("#inputField").val() == null) {
    //     $("#inputField").val($(this).text());
    //     } else
         $("#inputField").val($("#inputField").val() + $(this).text())
}

function clearMath() {
    $("#inputField").val('')
}

function calculate() {
    if ($("#inputField").val() === '') {
        $("#inputField").val('Enter Some Digits')
    } else {
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
    console.log(arr);
    $('#historyList').empty();
    for (calc of arr) {
        $('#historyList').append(`<li>
        ${calc.expression} = ${calc.result}
        </li>`)
    }
}

function clearHistory() {
    $.ajax({
        method: 'DELETE',
        url: '/calcHistory'
    }).then(function(response){
        resultHistory();
        $('#theResults').empty();
    })
}
