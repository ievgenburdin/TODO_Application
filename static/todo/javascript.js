/**
 * Created by Ievgen on 25.08.2017.
 */

document.onload = document.getElementById("defaultOpen").click();


function showProjectBtn(thisElement) {
    var project_menu, position;
    position = getPosition(thisElement);
    project_menu = document.getElementsByClassName("project_menu");
    hideProjectBtn();
    project_menu[position].style.display = "block";
}
function hideProjectBtn() {
    var i , project_menu;
    project_menu = document.getElementsByClassName("project_menu");
    for (i=0; i<project_menu.length; i++){
        project_menu[i].style.display = "none";
    }
}

 function getPosition(element) {
    var i, side_bar_menu_links;
    side_bar_menu_links = document.getElementsByClassName("side_bar_menu_links");
    for(i=2; i < side_bar_menu_links.length; i++){
        if (side_bar_menu_links[i] == element){
            return i-2
        }
    }
 }

function switchSideBarButton(evt) {
    var side_bar_menu_links;
    side_bar_menu_links = document.getElementsByClassName("side_bar_menu_links");
    for (var i = 0; i < side_bar_menu_links.length; i++){
        side_bar_menu_links[i].className = side_bar_menu_links[i].className.replace("active", "");
    }
    evt.currentTarget.className += " active";
}


function showHideProjectForm() {
    var projectForm, addProjectButton, projectEditForm;
    projectForm = document.getElementById("addProjectForm");
    projectEditForm = document.getElementById("editProjectForm");
    addProjectButton = document.getElementById("addProjectButton");
    if (projectForm.style.display === "block") {
        projectForm.style.display = "none";
        addProjectButton.style.display = "block";
    }
    else {
        projectEditForm.style.display = "none";
        projectForm.style.display = "block";
        addProjectButton.style.display = "none";
    }
}

function showHideProjectEditForm(projectName, projectColor) {
    var projectEditForm, addProjectButton, editProjectName, editProjectColor, projectForm;
    projectEditForm = document.getElementById("editProjectForm");
    addProjectButton = document.getElementById("addProjectButton");
    projectForm = document.getElementById("addProjectForm");
    document.getElementById("editProjectName").value = projectName;
    document.getElementById("editProjectColor").value = projectColor;
    if (projectEditForm.style.display === "block") {
        projectEditForm.style.display = "none";
        addProjectButton.style.display = "block";

    }
    else {
        projectForm.style.display = "none";
        projectEditForm.style.display = "block";
        addProjectButton.style.display = "none";
        window.oldProjectName = projectName;
        window.oldProjectColor = projectColor;
    }
}

/*
function showHideTaskForm() {
    var taskForm, addTaskButton;
    taskForm = document.getElementById("addTaskForm");
    addTaskButton = document.getElementById("addTaskButton");
    if (taskForm.style.display === "block") {
        taskForm.style.display = "none";
        addTaskButton.style.display = "block";
    }
    else {
        taskForm.style.display = "block";
        addTaskButton.style.display = "none";
    }
}
*/
function showHideTaskForm(operation, task) {
    var taskForm, addTaskButton, editTaskButton;
    taskForm = document.getElementById("addTaskForm");
    addTaskButton = document.getElementById("addTaskButton");
    if(operation == "edit"){
        task
    }
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
            var newButton, addButton, sideBarMenu, jsonResponse, cancelButton, errorProjectform, newMenu;
            cancelButton = document.getElementById("addProjectCancel");
            errorProjectform = document.getElementById("errorProjectForm");
            cancelButton.onclick = function () {
                xhr.abort();
            };
            if (xhr.status == 200 && xhr.readyState == 4) {
                jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse['errors']) {
                    errorProjectform.innerHTML = jsonResponse['errors'];
                } else{
                    addButton = document.getElementById("addProjectButton");
                    sideBarMenu = document.getElementById("side_bar_content");
                    newMenu = document.createElement('div');
                    newMenu.innerHTML = '<button class="project_button">Edit</button>' +
                                '<button class="project_button" onclick="deleteProject(' +
                                jsonResponse['name'] + ',"/todo/delete_project/")">Del</button>';
                    newMenu.className = "project_menu";
                    sideBarMenu.insertBefore(newMenu, addButton);
                    newButton = document.createElement('button');
                    newButton.className = "side_bar_menu_links";
                    newButton.innerHTML = '<div class="projectColor" style="background-color:' + jsonResponse['color'] + ';"></div>' +
                    '<div class="projectName">' + jsonResponse['name'] + '</div>';
                    document.getElementById("side_bar_content").appendChild(newButton);
                    showHideProjectForm();
                }
            }
        }
    }
}

function sendEditProjectForm(url) {
    var projectName, projectColor, errorProjectform, xhr, jsonProjectData;
    projectName = document.getElementById("editProjectName").value;
    projectColor = document.getElementById("editProjectColor").value;
    errorProjectform = document.getElementById("errorEditProjectForm");
    if (projectName === "") {
        errorProjectform.innerHTML = "Please enter project name";
    } else {
        xhr = new XMLHttpRequest();
        jsonProjectData = JSON.stringify({
            'oldProjectName': window.oldProjectName,
            'projectName': projectName,
            'projectColor': projectColor
        });
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(jsonProjectData);
        xhr.onreadystatechange = function () {
            var jsonResponse, cancelButton, errorProjectform, projectColor, nameProject;
            cancelButton = document.getElementById("editProjectCancel");
            errorProjectform = document.getElementById("errorEditProjectForm");
            cancelButton.onclick = function () {
                xhr.abort();
            };
            if (xhr.status == 200 && xhr.readyState == 4) {
                jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse['errors']) {
                    errorProjectform.innerHTML = jsonResponse['errors'];
                } else{
                    projectColor = document.getElementsByClassName('projectColor');
                    projectName = document.getElementsByClassName('projectName');
                    for (var i=0; i<projectName.length; i++){
                        if (projectName[i].textContent == window.oldProjectName){
                            projectName[i].innerHTML = jsonResponse['projectName'];
                            projectColor[i].style.backgroundColor = jsonResponse['projectColor'];
                        }
                    }
                    window.oldProjectName = null;
                    window.oldProjectColor = null;
                    showHideProjectEditForm();
                }
            }



        }
    }
}

function deleteProject(projectName, url) {
    var xhr, jsonProjectData;
    xhr = new XMLHttpRequest();
    jsonProjectData = JSON.stringify({
            'projectName': projectName
        });
    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(jsonProjectData);
    xhr.onreadystatechange = function () {
        var jsonResponse, errorProjectform, side_bar_menu_links, project_name, project_menu;
        errorProjectform = document.getElementById("errorProjectform");
        side_bar_menu_links = document.getElementsByClassName("side_bar_menu_links");
        if (xhr.status == 200 && xhr.readyState == 4) {
            jsonResponse = JSON.parse(xhr.responseText);
            if (jsonResponse['errors']) {
                errorProjectform.innerHTML = jsonResponse['errors'];
            } else{
                project_name = document.getElementsByClassName("project_name");
                project_menu = document.getElementsByClassName("project_menu");
                for (var i=0; i < project_name.length; i++){
                    if(project_name[i].textContent == projectName){
                        console.log(project_name[i].textContent);
                        side_bar_menu_links[i+2].remove();
                        project_menu[i].remove();
                    }
                }
            }
        }
    }
}


function sendTaskForm(url) {
    var taskTitle, taskProject, taskPriority,taskDate, errorTaskform, jsonTaskData;
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
            var taskPriorityColor, jsonResponse, cancelButton, taskTable, row, cell1, cell2, cell3, cell4;
            cancelButton = document.getElementById("addProjectCancel");
            cancelButton.onclick = function () {
                xhr.abort();
            };
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                jsonResponse = JSON.parse(xhr.responseText);
                taskTable = document.getElementById("task_menu_content");
                taskPriorityColor = setPriorityColor(jsonResponse['taskPriority']);
                row = taskTable.insertRow(1);
                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);
                cell3 = row.insertCell(2);
                cell4 = row.insertCell(3);
                cell1.innerHTML ='<div class="square" style="background-color:' + taskPriorityColor + '"></div>';
                cell2.innerHTML = jsonResponse['taskTitle'];
                cell3.innerHTML = jsonResponse['taskProject'];
                cell4.innerHTML = '<div class="square" style="background-color: ' + jsonResponse['taskProjectColor'] + '"></div>';
                showHideProjectForm();
            }
        }
    }
}

function getTasks(evt ,headerTitle ,url) {
    var xhr, row, cell1, cell2, cell3, cell4, cell5,tasksJSON, taskDate;
    switchSideBarButton(evt);
    document.getElementById('headerContent').innerHTML = headerTitle;
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
                cell5 = row.insertCell(4);
                cell1.innerHTML ='<div class="square" style="background-color:' + taskPriorityColor + '"></div>';
                cell2.innerHTML = tasksJSON[i]['title'];
                cell3.innerHTML = tasksJSON[i]['project'];
                cell4.innerHTML = '<div class="square" style="background-color: ' + tasksJSON[i]['projectColor'] + '"></div>';
                cell5.innerHTML = '<div class="task_menu">' + '' +
                    '<button class="task_button">Done</button>' +
                    '<button class="task_button">Edit</button></div>';
            }
        }
    };
    xhr.open('get', url, true);
    xhr.send();
}

function getProjectTasks(evt ,url, project) {
    document.getElementById('headerContent').innerHTML = project;
    switchSideBarButton(evt);
    var xhr, row, cell1, cell2, cell3, cell5, cell4,tasksJSON, taskDate;
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
                cell5 = row.insertCell(4);
                cell1.innerHTML ='<div class="square" style="background-color:' + taskPriorityColor + '"></div>';
                cell2.innerHTML = tasksJSON[i]['title'];
                cell3.innerHTML = tasksJSON[i]['project'];
                cell4.innerHTML = '<div class="square" style="background-color: ' + tasksJSON[i]['projectColor'] + '"></div>';
                cell5.innerHTML = '<div class="project_menu">' + '' +
                    '<button class="project_button">Done</button>' +
                    '<button class="project_button">Edit</button></div>' +
                    '<button class="project_button">Del</button></div>';
            }
        }
    };
    xhr.open('get', url +'?' + 'project=' + project, true);
    xhr.send();
}

function setPriorityColor(taskPriority, taskDate) {
    var priorityColor = {'3':'red', '2': 'orange', '1': 'green'};
    var today = new Date();
    console.log(taskDate, today);
    if (taskDate < today) {
        return 'red'
    } else {
        return priorityColor[taskPriority]
    }
}

