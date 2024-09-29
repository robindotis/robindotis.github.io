const HOLIDAY_ADDED = "Holiday added";
const HOLIDAY_UPDATED = "Holiday updated";
const HOLIDAY_NOT_ADDED_1 = "Holiday not added because 'Start date', 'End date' or both are not set.";
const HOLIDAY_NOT_ADDED_2 = "Holiday not added, because 'End date' before 'Start date'";

const OK_DUE_DATE = "ok";
const NOT_OK_DUE_DATE = "nok";

function CopyJson(id) {
    var jsonToCopy = document.getElementById(id).value;
    navigator.clipboard.writeText(jsonToCopy).then(
        () => {
            document.getElementById("message").innerHTML = "Copied successfully";
        },
        () => {
            document.getElementById("message").innerHTML = "Failed to copy, please try again";
        }
      );
}

function deleteHoliday(btn) {
    var localid = "";
    var formName = btn.getAttribute("form");
    var allInputs = document.querySelectorAll("input[hidden]");             
    allInputs.forEach((el) => {
        if(el.getAttribute("form") == formName) {
            localid = el.value;
        }
    })

    var holidays = []
    //remove localid from holidays
    if((localid != "") && !(localStorage.getItem("holidays") === null)){
        holidays = JSON.parse(localStorage.getItem("holidays"));
    
        holidays = holidays.filter(function(item) {
            return item.localid != localid;
        });

        localStorage.setItem("holidays",JSON.stringify(holidays));
        localStorage.setItem("msg","Holiday deleted");
        window.location.reload();

    }

}

function deleteTask(btn) {
    var localid = "";
    var formName = btn.getAttribute("form");
    var allInputs = document.querySelectorAll("input[hidden]");             
    allInputs.forEach((el) => {
        if(el.getAttribute("form") == formName) {
            localid = el.value;
        }
    })

    var objs = []
    //remove localid from array of objects
    if((localid != "") && !(localStorage.getItem("tasks") === null)){
        objs = JSON.parse(localStorage.getItem("tasks"));
    
        objs = objs.filter(function(item) {
            return item.localid != localid;
        });

        localStorage.setItem("tasks",JSON.stringify(objs));
        localStorage.setItem("msg","Task deleted");
        window.location.reload();

    }

}

function processHolidayForm(e) {
    //retrieve stored values
    //e.preventDefault();
    var startDate = "";
    var endDate = "";
    var formHolidays = [];
    var msg = "";
    var theForm = document.getElementById(e.target.id); 

    startDate = theForm["holiday-start"].value.trim();
    endDate = theForm["holiday-end"].value.trim();

    //check end date equal or larger than start date
    if (startDate == "" || endDate == ""){
        msg = HOLIDAY_NOT_ADDED_1;
    }
    else if((new Date(endDate)) < (new Date(startDate))) {
        msg = HOLIDAY_NOT_ADDED_2;
    }
    else {
        if(!(localStorage.getItem("holidays") === null)){
            formHolidays = JSON.parse(localStorage.getItem("holidays"));
        }

        //store the holidays
        var holidayRange = {};
        if(theForm["holiday-localid"] === undefined) {
            console.log("new holiday")
            holidayRange["localid"] = Math.floor(Date.now() / 1000).toString();
            msg = HOLIDAY_ADDED;
        }
        else {
            console.log("existing holiday")
            holidayRange["localid"] = theForm["holiday-localid"].value.trim();

            //existing task, remove from localstorage, 
            //  so don't have it twice in array
            formHolidays = formHolidays.filter(function(item) {
                            return item.localid != holidayRange["localid"];
                        });
            msg = HOLIDAY_UPDATED;
        }
        holidayRange["startDate"] = startDate.trim();
        holidayRange["endDate"] = endDate.trim();

        formHolidays.push(holidayRange);
        localStorage.setItem("holidays",JSON.stringify(formHolidays));
    }
    localStorage.setItem("msg",msg);
}

function processJSON(e) {
    localStorage.setItem("tasks",document.getElementById("json-tasks").value);
    localStorage.setItem("msg","Tasks uploaded successfully");
}

function processHolidaysJSON(e) {
    localStorage.setItem("holidays",document.getElementById("json-holidays").value);
    localStorage.setItem("msg","Holidays uploaded successfully");
}

function displaySystemMessage(){
    if(!(localStorage.getItem("msg") === null)){
        var msg = "";
        if(!(localStorage.getItem("msg") === "")){
            msg = localStorage.getItem("msg");
            document.getElementById("message").innerHTML = msg;
        }

        //reset holiday form if needed
        if(msg != HOLIDAY_ADDED && msg != HOLIDAY_UPDATED) {
            let params = new URLSearchParams(document.location.search);
            let startDate = params.get("holiday-start"); 
            let endDate = params.get("holiday-end");
            let localid = params.get("holiday-localid");
            var formName = "";

            // loop through all the hidden fields 
            // and see which one has the localid as it's value
            // use the form attribute value 
            // to identify the correct date fields to reset
            var allInputs = document.querySelectorAll("input[hidden]");             
            allInputs.forEach((el) => {
                if(el.value == localid) {
                    formName = el.getAttribute("form");
                }
            })

            var sel = "input[form='" + formName + "']";
            const inputs = document.querySelectorAll(sel);
            inputs.forEach((el) => {
                if(el.name == "holiday-start") {
                    el.value = startDate;   
                }
                else if(el.name == "holiday-end") {
                    el.value = endDate;   
                }
            })
        }

        localStorage.removeItem("msg");                
    }

}

function processForm(e) {
    //retrieve stored values
    //e.preventDefault();
    var formTasks = [];
    var msg = "";
    var theForm = document.getElementById(e.target.id); 
    if(!(localStorage.getItem("tasks") === null)){
        formTasks = JSON.parse(localStorage.getItem("tasks"));
    }

    //store the tasks
    var task = {};
    if(theForm["task-localid"] === undefined) {
        console.log("new task")
        task["localid"] = Math.floor(Date.now() / 1000).toString();
        msg = "Task added";
    }
    else {
        console.log("existing task")
        task["localid"] = theForm["task-localid"].value.trim();
        //existing task, remove from localstorage, 
        //  so don't have it twice in array
        formTasks = formTasks.filter(function(item) {
                        return item.localid != task["localid"];
                    });
        msg = "Task updated";
    }
    task["id"] = theForm["task-id"].value.trim();
    task["name"] = theForm["task-name"].value.trim();
    task["pages"] = theForm["task-pages"].value.trim();
    task["endDate"] = theForm["task-date"].value.trim();
    formTasks.push(task);

    //alert(JSON.stringify(formTasks));
    localStorage.setItem("tasks",JSON.stringify(formTasks));
    localStorage.setItem("msg",msg);
    //return false;
}

function FormatDate(oDay) {
    return oDay.getFullYear() + "-" + 
                (oDay.getMonth()+1).toString().padStart(2,0) + "-" + 
                oDay.getDate().toString().padStart(2,0);
}

function appendTaskRow(sDay, sTask, sTaskHours, sTotalHours, sClass) {
    const tbody = document.querySelector("#planner");
    const template = document.querySelector('#day');
    const clone = template.content.cloneNode(true);

    const theTask = tasks.find(item => item.id === sTask);

    let td = clone.querySelectorAll("td");
    td[0].textContent = sDay;
    td[1].setHTML(sTask);
    td[2].setHTML(sTaskHours);
    td[3].textContent = sTotalHours;

    if(sClass.length > 0) {
        let tr = clone.querySelectorAll("tr");
        tr[0].classList.toggle(sClass)
    }
    
    tbody.appendChild(clone);
}

function displayTaskList(taskList) {
    const forms = document.querySelector("#forms");
    const tbody = document.querySelector("#taskstable");
    const templateForm = document.querySelector('#taskForm');
    const templateInputs = document.querySelector('#taskInputs');

    //alert(template.content);
    for (let k = 0; k < taskList.length; k++) {
        //duplicate the form tags, which need to be outside the table
        const cloneForm = templateForm.content.cloneNode(true);
        let form = cloneForm.querySelectorAll("form");
        form[0].id = form[0].id + (k + 1);
        forms.appendChild(cloneForm);

        //duplicate table row with form fields
        const clone = templateInputs.content.cloneNode(true);
        let inputs = clone.querySelectorAll("input");

        //link inputs to the correct form tag
        for(let i = 0; i < inputs.length; i++) {
            inputs[i].setAttribute("form","form" + (k + 1));
        }

        inputs[0].value = taskList[k].localid.trim();
        inputs[1].value = taskList[k].id.trim();
        inputs[2].value = taskList[k].name.trim();
        inputs[3].value = taskList[k].pages.trim();
        inputs[4].value = taskList[k].endDate.trim();

        tbody.appendChild(clone);
    }
}

function displayHolidayFields() {

    //only continue if there are holidays in localstorage
    if(!(localStorage.getItem("holidays") === null)){
        const forms = document.querySelector("#holidayForms");
        const tbody = document.querySelector("#holidaystable");
        const templateForm = document.querySelector('#holidayForm');
        const templateInputs = document.querySelector('#holidayInputs');

        var jsonHolidays = localStorage.getItem("holidays");

        holidays = JSON.parse(jsonHolidays);
        document.getElementById("jsonHolidaysCurrent").value = jsonHolidays;

        holidays.sort((a, b) => {
            return new Date(a.startDate) - new Date(b.startDate); // descending
        })
    
        //alert(template.content);
        for (let k = 0; k < holidays.length; k++) {
            //duplicate the form tags, which need to be outside the table
            const cloneForm = templateForm.content.cloneNode(true);
            let form = cloneForm.querySelectorAll("form");
            form[0].id = form[0].id + (k + 1);
            forms.appendChild(cloneForm);

            //duplicate table row with form fields
            const clone = templateInputs.content.cloneNode(true);
            let inputs = clone.querySelectorAll("input");

            //link inputs to the correct form tag
            for(let i = 0; i < inputs.length; i++) {
                inputs[i].setAttribute("form",inputs[i].getAttribute("form") + (k + 1));
            }

            inputs[0].value = holidays[k].localid.trim();
            inputs[1].value = holidays[k].startDate.trim();
            inputs[2].value = holidays[k].endDate.trim();

            tbody.appendChild(clone);
        }

    }
}

function getUserTaskId(timestamp){
    var theTask = tasks.find(item => item.localid === timestamp);
    return theTask.name + " (" + theTask.id + ")";
}

function processHolidays(){
    if(!(localStorage.getItem("holidays") === null)){
        var jsonHolidays = localStorage.getItem("holidays");
        holidayDays = [];
        holidays = JSON.parse(jsonHolidays);
        document.getElementById("jsonHolidaysCurrent").value = jsonHolidays;

        holidays.sort((a, b) => {
            return new Date(a.startDate) - new Date(b.startDate); // ascending
        })

        holidays.forEach((el) => {
            var holStart = new Date(el.startDate);
            var holEnd = new Date(el.endDate);
            var hol = holStart;
            while(hol <= holEnd) {
                holidayDays.push(FormatDate(hol));
                hol.setDate(hol.getDate() + 1);
            }
        })      
    }
}

function processTasks(){
    //only continue if there are tasks in localstorage
    if(!(localStorage.getItem("tasks") === null)){
        
        processHolidays();
        
        var jsonTasks = localStorage.getItem("tasks");
        //alert(jsonTasks);
        tasks = JSON.parse(jsonTasks);
        document.getElementById("jsonCurrent").value = jsonTasks;

        tasks.sort((a, b) => {
            return new Date(a.endDate) - new Date(b.endDate); // descending
        })

        
        displayTaskList(tasks);

        let totalHours = [];
        let i = 0;
        for (let k = 0; k < tasks.length; k++) {
            for (let j = 0; j < ((tasks[k].pages) * hoursPerPage); j++) {
                totalHours[i] = tasks[k].localid;
                i++;
            }
        }
        totalHours.reverse();

        var dayCount = 0;
        var previousDay = "";
        var previousTaskId = ""
    //            var currentTaskHours = 0;
        var counter = 0;
        var WorkToDo = true;
        var firstTaskId = "";
        var cellTaskId = "";
        var cellTaskHours = "";
        var cellClass = "";
        var skipHour = false;
        var previousDayLastTaskOneHour = false;

        while(WorkToDo) {
            var theDay = new Date(Date.now() + (3600 * 1000 * 24) * dayCount);
            dayCount++;

            var currentDay = FormatDate(theDay);
            var cellDate = currentDay;
            cellTaskId = "";
            cellClass = "";

            //check if saturday (6) or sunday (0)
            if (theDay.getDay() == 0 || 
                theDay.getDay() == 6) {

                //add row in the table
                cellTaskId = "Weekend";
                cellClass = "nowork";
                cellTaskHours = "";
            }
            //check if holidays
            else if ((holidayDays.find(item => {return item == FormatDate(theDay)}) || []).length > 0) {
                //add row in the table
                cellTaskId = "Holiday";
                cellClass = "nowork";
                cellTaskHours = "";

            }
            else { 
                //new working day, start doing the tasks, 
                //take 8 hours from the array, then move to the next day
                var hourCount = 0;
                var taskCurrentDayHours = 0;
                var firstHourOfDay = true;
                var newFirstTaskOfDayId = "";
                var firstTaskOfDayId = "";
                var currentTaskHours = 0;
                cellClass = OK_DUE_DATE;

                for (var h = 0; h < hoursPerDay; h++) {
                    var currentTaskId = totalHours.pop();

                    //determine if current date is after task due date
                    const currentTaskEndDate = tasks.find(item => item.localid === currentTaskId);
                    if(new Date(currentTaskEndDate.endDate) < theDay) {
                        cellClass = NOT_OK_DUE_DATE;
                    }

                    firstTaskOfDayId = currentTaskId;
                    currentTaskHours++;
                    if (h == 0) {
                        //set task id
                        cellTaskId = getUserTaskId(currentTaskId);
                        if (currentTaskId != previousTaskId) {
                            newFirstTaskOfDayId = currentTaskId;
                        }
                    }
                    else if (currentTaskId != previousTaskId) {
                        //determine if current date is after task due date
                        const currentTaskEndDate = tasks.find(item => item.localid === currentTaskId);
                        //alert(new Date(currentTaskEndDate.endDate));
                        if(new Date(currentTaskEndDate.endDate) < theDay) {
                            cellClass = NOT_OK_DUE_DATE;
                        }
                        else {
                            cellClass = OK_DUE_DATE;
                        }

                        //append taskId to cell
                        cellTaskId = cellTaskId + "<br>" + getUserTaskId(currentTaskId);
                        
                        //set hours for previous task
                        if (cellTaskHours == ""){
                            cellTaskHours = h + " :1";
                        } 
                        else {
                            cellTaskHours = cellTaskHours + "<br>" + (currentTaskHours - 1) + " :2";
                        }
                        currentTaskHours = 0; 
                    }

                    //last hour in day
                    if (h == (hoursPerDay - 1)) {
                        //append hours
                        if(cellTaskHours == "") {
                            if(newFirstTaskOfDayId == currentTaskId) {
                                currentTaskHours--;
                            }
                            cellTaskHours = currentTaskHours + " :3";
                        }
                        else {
                            if(currentTaskHours == 0) {
                                currentTaskHours++;
                            }
                            cellTaskHours = cellTaskHours + "<br>" + currentTaskHours + " :4";
                        }
                    }

                    hourCount++;
                    if (currentTaskId != previousTaskId) {
                        currentTaskHours++;
                    }

                    previousTaskId = currentTaskId;
                    firstHourOfDay = false;

                    if(totalHours.length == 0) {
                        if(h < (hoursPerDay - 1)) {
                            if(cellTaskHours == "") {
                                if(firstTaskOfDayId != currentTaskId){
                                    currentTaskHours--;
                                }
                                cellTaskHours = currentTaskHours + " :5";
                            }
                            else {
                                if(currentTaskHours == 0) {
                                    currentTaskHours++;
                                }
                                cellTaskHours = cellTaskHours + "<br>" + currentTaskHours + " :6";
                            }
                        }
                        break;
                    }
                }
            }
            
            counter ++;
            appendTaskRow(cellDate, cellTaskId, cellTaskHours, counter, cellClass);
            WorkToDo = (totalHours.length > 0);
            cellDate = cellTaskId = cellTaskHours = "";
        }

    }
}

const hoursPerPage = 1;
const hoursPerDay = 8;
const pagesPerHour = 1 / hoursPerPage;
const pagesPerDay = pagesPerHour * hoursPerDay;
var holidayDays = ["2023-03-01","2023-03-02"];
var holidays = [];
var tasks = [];


displayHolidayFields();
displaySystemMessage();
processTasks();
