$(document).ready(onReady);

function onReady() {
    $('#calcContainer').on('click', '.buttons', addMath);
    $('#clearBtn').on('click', clearMath);
    $('#equalsBtn').on('click', validateInput);
    $('#eraserImg').on('click', clearHistory);
    $('#historyList').on('click', '.eraserDiv', deleteHistoryEvent);
    $('#historyList').on('click', '.historyItem', getExpression);
    getHistory();
    allowOneOperator(); // Allows only one operator be selected
}

function addMath() {
    $("#inputField").val($("#inputField").val() + $(this).text()); // Adds numbers to input
}

function addOperator() {
    $("#inputField").val($("#inputField").val() + $(this).text()); // Adds operator to input
}

function clearMath() {
    $("#inputField").val(''); // Clear input field
    $('#theResults').empty(); // Clear results
    allowOneOperator(); // Allow another operator be selected.
}

function allowOneOperator() { //Allows for only one operator to be clicked
    $('#calcContainer').one('click', '.operators', addOperator)
}

function validateInput() {
    $("#theResults").empty();
    let el = $("#inputField").val(); // grab expression
    let last = el.length - 1; // last index of string
    if (el === '') { // If input is empty, let user know they need an expression
        $("#theResults").text('Please Enter Some Digits')
    } else if (el.charAt(0) === '+' || el.charAt(0) === '-' || el.charAt(0) === '*' || el.charAt(0) === '/') { //if first character is operator
        $("#theResults").text('Invalid Expression'); // Notify user it is an invalid expression
        $("#inputField").val(''); // clear out input field
        allowOneOperator(); //Allow user to click another operator
    } else if (el.charAt(last) === '+' || el.charAt(last) === '-' || el.charAt(last) === '*' || el.charAt(last) === '/') { //If last character is an operator
        $("#theResults").text('Invalid Expression'); //
        $("#inputField").val('');
        allowOneOperator();
    } else if (el.includes('+') || el.includes('-') || el.includes('*') || el.includes('/')) { // expression must include an operator
        calculate(); // Run calculation if all above conditions are met
    } else {
        $("#theResults").text('Invalid Expression'); // Default if any other condition is not met
        $("#inputField").val('');
    }
}

function calculate() {
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: {
            expression: {
                input: $('#inputField').val() //Send expression to server for calculation
            }
        }
    }).then(function (response) {
        getResult(); // Run a function to get the results from server if calculation is completed
        $("#inputField").val('')
        allowOneOperator(); // After calculating, Allow another operator for next expression
    }).catch(function (response) {
        console.log('Failed to calculate expression');
    })
}

function getResult() {
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function (response) {
        renderResult(response); //Grabbing array from server and sending the render function to show on DOM
    }).catch(function (response) {
        console.log('Failed to get results');
    })
}

function renderResult(res) {
    $('#theResults').empty();
    $('#theResults').append(res[0].result); // Display the most recent results in results field.
    getHistory(); // Run get history to update the calc history list
}

function getHistory() {
    $.ajax({
        method: 'GET',
        url: '/calcHistory'
    }).then(function (response) {
        renderHistory(response); //Send history array from server through the render function
    }).catch(function (response) {
        console.log('Failed to get calculation history');
    })
}

function renderHistory(arr) {
    $('#historyList').empty();
    for (let i = 0; i < arr.length; i++) { // Looping through history array to display all previous expressions
        $('#historyList').append(`
        <li class="historyItem" id="${i}">
        ${arr[i].num1} ${arr[i].operator} ${arr[i].num2} = ${arr[i].result}  
        <div class="eraserDiv"><i class="fas fa-eraser"></i></div></li>`);
    }
}

function clearHistory() {
    $('#theResults').empty();
    $.ajax({
        method: 'DELETE',
        url: '/calcHistory'
    }).then(function (response) {
        getHistory();
    }).catch(function (response) {
        console.log('Failed to clear history');
    })
}

function getExpression() {
    let id = $(this).attr('id') // Array index of selected expression.
    $.ajax({
        method: 'GET',
        url: '/calcHistory',
    }).then(function (response) {
        renderExpression(response[id]); // Grabbing the array from server and sending the specific index through render expression.
    }).catch(function (response) {
        console.log('Failed to get expression');
    })
}

function renderExpression(obj) {
    $('#theResults').empty(); //Clear results field
    $('#inputField').val(''); //Clear input field
    $('#theResults').append(obj.result); //Put the results from selected item into the results
    $('#inputField').val(obj.expression); //Put the expression back into the calculator display
}

function deleteHistoryEvent() {
    $('#theResults').empty();
    let id = $(this).parent().attr('id'); //Grabbing index of the expression to send to server
    $.ajax({
        method: 'DELETE',
        url: '/removeExp',
        data: {
            index: id //sending array index to server for deletion of selected expression
        }
    }).then(function (response) {
        getHistory();
        $('#theResults').empty();
        $('#inputField').val(''); //Run get history upon completion so the history list can be updated on the DOM
    }).catch(function (response) {
        console.log('Failed to delete expression');
    })

}