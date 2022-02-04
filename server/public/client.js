$(document).ready(onReady);

function onReady(){
    $('#calcContainer').on('click', '.buttons', addMath);
    $('#clearBtn').on('click', clearMath);
    $('#equalsBtn').on('click', calculate)
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
    })
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
      console.log(response);
    })
}

function renderHistory(arr) {
    console.log(arr);
    $('#historyList').empty();
    for (calc of arr) {
        $('#historyList').append(`<li>
        ${calc.expression} ${calc.result}
        </li>`)
    }
}