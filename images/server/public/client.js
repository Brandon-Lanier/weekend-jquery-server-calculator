$(document).ready(onReady);

function onReady(){
    $('#calcContainer').on('click', '.buttons', addMath);
    $('#clearBtn').on('click', clearMath);
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

