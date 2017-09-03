/**
 * Created by Ievgen on 25.08.2017.
 */

    //document.onload = document.getElementById("defaultOpen").click();


/*
    function hideTaskMenuItems() {
        var task_menu_content;
        task_menu_item = document.getElementsByClassName("task_menu_item");
        for (i = 0; i < task_menu_item.length; i++){
            task_menu_item[i].style.display = "none";
        }
    }
    */

    function switchSideBarButton(evt) {
        var side_bar_menu_links;
        side_bar_menu_links = document.getElementsByClassName("side_bar_menu_links");
        for (i = 0; i < side_bar_menu_links.length; i++){
            side_bar_menu_links[i].className = side_bar_menu_links[i].className.replace("active", "");
        }
        evt.currentTarget.className += " active";
    }
/*
    function openTasksByDate(evt, numOfDays) {
        var i, today,nextDays, task_dates, task_date, day;
        hideTaskMenuItems();
        task_dates = document.getElementsByClassName("task_date");
        today = new Date();
        nextDays = new Date();
        nextDays.setDate(today.getDate() + numOfDays);
        for (i = 0; i < task_dates.length; i++){
            task_date = new Date(task_dates[i].textContent);
            if (task_date <= nextDays){
                task_dates[i].parentNode.style.display = "block";
            }
        }
        switchSideBarButton(evt);
    }

    function openProject(evt, porjectName) {
        var i, task_projects;
        task_projects = document.getElementsByClassName("task_project");
        hideTaskMenuContent();
        for (i = 0; i < task_projects.length; i++){
            if (task_projects[i].textContent === porjectName){
                task_projects[i].parentNode.style.display = "block";
            }
        }
        switchSideBarButton(evt);
    }
*/
    function showHideProjectForm() {
        var projectForm, addProjectButton;
        projectForm = document.getElementById("addProjectForm");
        addProjectButton = document.getElementById("addProjectButton");
        if (projectForm.style.display === "block") {
                projectForm.style.display = "none";
                addProjectButton.style.display = "block";
            }
        else {
            projectForm.style.display = "block";
            addProjectButton.style.display = "none";

        }
    }

    function showHideTaskForm() {
        var taskForm, addTaskButton;
        taskForm = document.getElementById("addTaskForm");
        addTaskButton = document.getElementById("addTasktButton");
        if (taskForm.style.display === "block") {
                taskForm.style.display = "none";
                addTaskButton.style.display = "block";
            }
        else {
            taskForm.style.display = "block";
            addTaskButton.style.display = "none";

        }
    }

    function sendProjectForm(user, url) {
        var projectName, projectColor, xhr, jsonProjectData, errorProjectform;
        projectName = document.getElementById("projectName").value;
        projectColor = document.getElementById("projectColor").value;
        errorProjectform = document.getElementById("errorProjectform");
        if (projectName === "") {
            errorProjectform.innerHTML = "Please enter project name";
        } else {
            xhr = new XMLHttpRequest();
            jsonProjectData = JSON.stringify({
                'projectName': projectName,
                'projectColor': projectColor,
                'user':user
            });
            xhr.open('post', url, true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(jsonProjectData);
            xhr.onreadystatechange = function () {
                var newButton, addButton, sideBarMenu, jsonResponse, cancelButton;
                cancelButton = document.getElementById("addProjectCancel");
                cancelButton.onclick = function () {
                    xhr.abort();
                };
                if (xhr.status == 200 && xhr.readyState == 4) {
                    jsonResponse = JSON.parse(xhr.responseText);
                    newButton = document.createElement('button');
                    addButton = document.getElementById("addProjectButton");
                    newButton.className = "side_bar_menu_links";
                    newButton.innerHTML = jsonResponse['name'] +
                        "<div class='colorProject' style='background-color: " + jsonResponse['color'] + ";'></div>";
                    sideBarMenu = document.getElementById("side_bar_content");
                    sideBarMenu.insertBefore(newButton, addButton);
                    showHideProjectForm();
                } else {
                    console.log("NOT SuccessLoad");
                }
            }
        }
    }

    function sendTaskForm(evt, url) {
        switchSideBarButton(evt);
        var taskTitle, taskProject, taskPriority, taskDate, xhr, jsonTaskData, errorTaskform;
        taskTitle = document.getElementById("taskTitleInput").value;
        taskProject = document.getElementById("taskProjectInput").value;
        taskPriority = document.getElementById("taskPriorityInput").value;
        taskDate = document.getElementById("taskDateInput").value;
        errorTaskform = document.getElementById("errorTaskform");
        if (taskDate === "" || taskTitle === ""){
            errorTaskform.innerHTML = "Please fill all field";
        } else {
            xhr = new XMLHttpRequest();
            jsonTaskData = JSON.stringify({
                'taskTitle':taskTitle,
                'taskProject': taskProject,
                'taskPriority': taskPriority,
                'taskDate': taskDate
            });
            xhr.open('post', url, true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(jsonTaskData);
            xhr.onreadystatechange = function () {
                var newButton, addButton, taskMenu, jsonResponse, cancelButton;
                cancelButton = document.getElementById("addProjectCancel");
                cancelButton.onclick = function () {
                    xhr.abort();
                };
                if (xhr.readyState != 4) return;
                if (xhr.status == 200) {
                    jsonResponse = JSON.parse(xhr.responseText);
                    newButton = document.createElement('button');
                    addButton = document.getElementById("addTaskButton");
                    newButton.className = "side_bar_menu_links";
                    newButton.innerHTML = jsonResponse['name'] +
                            "<div class='colorProject' style='background-color: " + jsonResponse['color'] + ";'></div>";
                    sideBarMenu = document.getElementById("side_bar_content");
                    sideBarMenu.insertBefore(newButton, addButton);
                    console.log(jsonResponse['taskTitle'], jsonResponse['taskDate'], jsonResponse['taskPriority'], jsonResponse['taskProject']);
                    showHideProjectForm();
                } else {
                    console.log("NOT SuccessLoad");
                }
            }
        }
    }

function getData(url) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        var projects, tasks;
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.TasksJSON = xhr.response['tasks'];
            window.ProjectsJSON = xhr.response['projects'];
        }
    };
    xhr.open('get', url, true);
    xhr.send();
}

function getTasks(url) {
    var xhr, row, cell1, cell2, cell3, cell4,tasksJSON, taskDate;
    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        var tasks, taskPriorityColor, taskTable, rows;
        if (xhr.readyState == 4 && xhr.status == 200) {
            tasksJSON = xhr.response['tasks'];
            //Cleaning rows
            taskTable = document.getElementById("task_menu_content");
            rows = taskTable.getElementsByTagName("tr");
            if (rows.length > 1){
                while (rows.length != 1){
                    taskTable.deleteRow(rows.length-1);
                }
            }
            for (var i=0; i<tasksJSON.length; i++){
                taskDate = new Date();
                taskDate.setYear(tasksJSON[i]['date']['year']);
                taskDate.setMonth(tasksJSON[i]['date']['month']-1);
                taskDate.setDate(tasksJSON[i]['date']['day']);
                taskPriorityColor = setPriorityColor(tasksJSON[i]['priority'], taskDate);
                //Makeing row in table from received JSON
                row = taskTable.insertRow(1);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell3 = row.insertCell(2);
                cell4 = row.insertCell(3);
                cell1.innerHTML ='<div class="square" style="background-color:' + taskPriorityColor + '"></div>';
                cell2.innerHTML = tasksJSON[i]['title'];
                cell3.innerHTML = tasksJSON[i]['project'];
                cell4.innerHTML = '<div class="square" style="background-color: ' + tasksJSON[i]['projectColor'] + '"></div>';
            }
        }
    };
    xhr.open('get', url, true);
    xhr.send();
}

function getProjectTasks(url, project) {
    var xhr, row, cell1, cell2, cell3, cell4,tasksJSON, taskDate;
    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        var tasks, taskPriorityColor, taskTable, rows;
        if (xhr.readyState == 4 && xhr.status == 200) {
            tasksJSON = xhr.response['tasks'];
            //Cleaning rows
            taskTable = document.getElementById("task_menu_content");
            rows = taskTable.getElementsByTagName("tr");
            if (rows.length > 1){
                while (rows.length != 1){
                    taskTable.deleteRow(rows.length-1);
                }
            }
            for (var i=0; i<tasksJSON.length; i++){
                taskDate = new Date();
                taskDate.setYear(tasksJSON[i]['date']['year']);
                taskDate.setMonth(tasksJSON[i]['date']['month']-1);
                taskDate.setDate(tasksJSON[i]['date']['day']);
                taskPriorityColor = setPriorityColor(tasksJSON[i]['priority'], taskDate);
                //Makeing row in table from received JSON
                row = taskTable.insertRow(1);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell3 = row.insertCell(2);
                cell4 = row.insertCell(3);
                cell1.innerHTML ='<div class="square" style="background-color:' + taskPriorityColor + '"></div>';
                cell2.innerHTML = tasksJSON[i]['title'];
                cell3.innerHTML = tasksJSON[i]['project'];
                cell4.innerHTML = '<div class="square" style="background-color: ' + tasksJSON[i]['projectColor'] + '"></div>';
            }
        }
    };
    xhr.open('get', url +'?' + 'project=' + project, true);
    xhr.send();
}

function setPriorityColor(taskPriority, taskDate) {
    var priorityColor = {'1':'red', '2': 'orange', '3': 'green'};
    var today = new Date();
    console.log(taskDate < today);
    if (taskDate < today) {
        return 'red'
    } else {
        return priorityColor[taskPriority]
    }
}
