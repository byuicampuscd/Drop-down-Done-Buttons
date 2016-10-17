/********************************************************
    The purpose of course.js is to house only the JavaScript
    specific to an individual course. The online.js
    houses all the default JavaScript.
********************************************************/
/* DO NOT DELETE OR MODIFY THIS SECTION */
/* Append Script Tag for Online.js to the Body Tag */
var onlineJs = document.createElement("script");
onlineJs.src = 'https://content.byui.edu/integ/gen/00134d04-34d1-47b8-9242-c29059c522ee/0/online.js';
document.body.appendChild(onlineJs);

/* Add Course Specific JavaScript Below */

/**************************************** 
    Drop-down Done Buttons
****************************************/
(function () {
    var name = "",
        data = {};

    function initCheckboxes() {
        var dropDowns = document.querySelectorAll('.drop-down'),
            checkboxes = document.querySelectorAll('.check'),
            checkLables = document.querySelectorAll('.check-wrapper label'),
            courseCode,
            file,
            i;
        /* If no checkboxs then return */
        if (checkboxes.length === 0) {
            return;
        }

        /* Get unique name for page to use in local storage */
        courseCode = window.location.search.split("&");
        for (i = 0; i < courseCode.length; i++) {
            if (courseCode[i].indexOf("ou=") != -1) {
                name = courseCode[i].slice(3);
                break;
            }
        }
        /* Get unique file name to add to unique name for local storage */
        file = window.location.pathname.split("/");
        name += "-" + file.pop();

        /* Apply class for checkbox styling and set event trigger on checkboxes */
        for (i = 0; i < checkboxes.length; i++) {
            checkboxes[i].parentElement.style.display = "inline-block";
            checkboxes[i].parentElement.previousElementSibling.classList.add('check-item');
            checkboxes[i].onchange = saveCheckbox;
        }

        /* Disable outlines on drop downs and checkboxs until user uses the tab key */
        for (i = 0; i < dropDowns.length; i++) {
            dropDowns[i].style.outline = 'none';
        }
        for (i = 0; i < checkLables.length; i++) {
            checkLables[i].style.outline = 'none';
        }
        window.onkeydown = allowOutlines;
        setCheckboxes();
        window.addEventListener("load", sizeCheckWrappers);
        window.addEventListener("resize", sizeCheckWrappers);
    }

    /* Size checkbox wrappers to the same height as the drop-down */
    function sizeCheckWrappers() {
        var wrappers = document.querySelectorAll('.check-wrapper');
        for (i = 0; i < wrappers.length; i++) {
            wrappers[i].style.height = wrappers[i].previousElementSibling.offsetHeight + 'px';
        }
    }

    /* Check for stored data and use it to set checkboxes */
    function setCheckboxes() {
        if (typeof localStorage[name] != "undefined") {
            data = JSON.parse(localStorage[name]);
            for (checkbox in data) {
                if (data[checkbox] && checkbox != "shownMsg") {
                    document.getElementById(checkbox).checked = true;
                }
            }
        }
    }

    /* Display a message about the checkbox tool */
    function showMsg() {
        var overlay = '<div id="overlay"><div id="alertBox"><p><b>Important</b></p><p>Checking items off on this page is for your convience only. It is not required nor does it affect your grade. The data is only stored in the browser and will not update to other browsers or computers.<br><button>Ok</button></p></div></div>';
        document.getElementById("main").insertAdjacentHTML("afterend", overlay);
        document.querySelector('#alertBox button').addEventListener('click', closeMsg);
        document.querySelector('#alertBox button').addEventListener('keydown', closeMsg);
        /* Hide #main from screen readers until overlay is closed */
        document.getElementById("main").setAttribute('aria-hidden', true);
        /* Keep keyboard focus on #alertBox button until closed */
        window.onkeydown = function (e) {
            if (e.keyCode === 9) {
                e.preventDefault();
                document.querySelector("#alertBox button").focus();
            }
        };
    }

    function closeMsg(e) {
        // Only allow enter or spacebar to close the message a keydown event.
        if (e.type === "keydown" && !(e.keyCode === 32 || e.keyCode === 13)) {
            return;
        }
        document.getElementById('overlay').style.display = 'none';
        /* Re-enable main content to screen readers */
        document.getElementById("main").setAttribute('aria-hidden', false);
        /* Release focus */
        window.onkeydown = null;
    }


    /* Save checkbox state in localstorage */
    function saveCheckbox() {
        if (typeof data["shownMsg"] === "undefined") {
            showMsg();
            data["shownMsg"] = true;
        }
        data[this.id] = this.checked;
        localStorage.setItem(name, JSON.stringify(data));
    }

    function allowOutlines() {
        var dropDowns = document.querySelectorAll('.drop-down'),
            checkLables = document.querySelectorAll('.check-wrapper label');
        for (i = 0; i < dropDowns.length; i++) {
            dropDowns[i].style.outline = '';
        }
        for (i = 0; i < checkLables.length; i++) {
            checkLables[i].style.outline = '';
        }
        window.onkeydown = '';
    }

    initCheckboxes();
})();