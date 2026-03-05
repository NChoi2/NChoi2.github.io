//adding guests addeventlistener ENTER
document.addEventListener("DOMContentLoaded", function () {

    let userinput = document.getElementById('user');

    if (userinput) {
        userinput.addEventListener('keyup', function(event) {
            if (event.key === "Enter") {
                addItem();
            }
        });
    }

});

//removing guests addeventlistener ENTER
document.addEventListener("DOMContentLoaded", function () {

    let delnum = document.getElementById('deleteNum');

    if (delnum) {
        delnum.addEventListener('keyup', function(event) {
            if (event.key === "Enter") {
                removeItem();
            }
        });
    }

});
