/**
 * Created by Ievgen on 25.08.2017.
 */

document.onload = onload();
function onload() {
    //document.getElementById("defaultOpen").click();
}

function showProjectBtn(thisElement) {
    var project_menu, position, side_bar_menu_links;
    side_bar_menu_links = document.getElementsByClassName("side_bar_menu_links");
    position = getPosition(thisElement, side_bar_menu_links);
    project_menu = document.getElementsByClassName("project_menu");
    hideMenuBtn(project_menu);
    project_menu[position-2].style.display = "block";
}
function hideProjectBtn() {
    var project_menu = document.getElementsByClassName("project_menu");
    hideMenuBtn(project_menu);
}
function hideMenuBtn(menu) {
    var i;
    for (i=0; i<menu.length; i++){
        menu[i].style.display = "none";
    }
}

 function getPosition(element, element_list) {
    var i;
    for(i=0; i < element_list.length; i++){
        if (element_list[i] === element){
            return i
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
                    newMenu = document.createElement('div');
                    newMenu.innerHTML = '<button class="project_button">Edit</button>' +
                                '<button class="project_button" onclick="deleteProject(' +
                                jsonResponse['name'] + ',"/todo/delete_project/")">Del</button>';
                    newMenu.className = "project_menu";
                    document.getElementById("side_bar_content").appendChild(newMenu);
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


function showTaskEditForm(element) {
    var position, task_edit_button, task_row, priority, title, project, date,
        addTaskButton, addTaskFormButton, cancelTaskFormButton;

    addTaskButton = document.getElementById("addTaskButton");
    addTaskFormButton = document.getElementById("addTaskFormButton");
    cancelTaskFormButton = document.getElementById("cancelTaskFormButton");

    task_edit_button = document.getElementsByClassName('task_edit_button');
    position = getPosition(element, task_edit_button);
    task_row = document.getElementsByClassName('task_row')[position];
    priority = task_row.children[0].textContent;
    title = task_row.children[1].textContent;
    project = task_row.children[2].textContent;
    date = task_row.children[3].textContent;
    task = {'priority':priority,
        'title':title,
        'project':project,
        'date':date
    };
    window.oldTaskTitle = title;
    document.getElementById('taskTitleInput').value = task['title'];
    document.getElementById('taskProjectInput').value = task['project'];
    document.getElementById('taskPriorityInput').value = task['priority'];
    document.getElementById('taskDateInput').value = task['date'];
    document.getElementById("addTaskForm").style.display = "block";
    addTaskFormButton.innerText = "Edit";
    cancelTaskFormButton.addEventListener('click', function () {
        hideTaskEditForm()
    });
    addTaskFormButton.addEventListener('click', function () {
        sendEditTaskForm('/edit_task/')
    });
    addTaskButton.style.display = "none";
}

function hideTaskEditForm() {
    var taskForm, addTaskButton, addTaskFormButton, cancelTaskFormButton;
    taskForm = document.getElementById("addTaskForm");
    addTaskButton = document.getElementById("addTaskButton");
    addTaskFormButton = document.getElementById("addTaskFormButton");
    cancelTaskFormButton = document.getElementById("cancelTaskFormButton");
    document.getElementById('taskTitleInput').value = "Enter task title";
    document.getElementById('taskProjectInput').value = "";
    document.getElementById('taskPriorityInput').value = "";
    document.getElementById('taskDateInput').value = "";
    addTaskFormButton.innerText = "Add";
    taskForm.style.display = "none";
    addTaskButton.style.display = "block";
    addTaskFormButton.removeEventListener('click', function () {
        sendTaskForm('/edit_task/')
    });
    cancelTaskFormButton.removeEventListener('click', function () {
        hideTaskEditForm()
    });
}


function showHideTaskAddForm() {
    var taskForm, addTaskButton, addTaskFormButton, cancelTaskFormButton;
    taskForm = document.getElementById("addTaskForm");
    addTaskButton = document.getElementById("addTaskButton");
    addTaskFormButton = document.getElementById("addTaskFormButton");
    cancelTaskFormButton = document.getElementById("cancelTaskFormButton");
    if (taskForm.style.display === "block") {
        taskForm.style.display = "none";
        addTaskButton.style.display = "block";
        addTaskFormButton.addEventListener('click', function () {
            sendTaskForm('/add_task/')
        });
        cancelTaskFormButton.addEventListener('click', function () {
            showHideTaskAddForm()
        });
        addTaskFormButton.innerText = "Add";
    }
    else {
        taskForm.style.display = "block";
        addTaskButton.style.display = "none";
        addTaskFormButton.removeEventListener('click', function () {
            sendTaskForm('/add_task/')
        });
        cancelTaskFormButton.addEventListener('click', function () {
            showHideTaskAddForm()
        });

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


function sendEditTaskForm(url) {
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
            'oldTaskTitle':window.oldTaskTitle,
            'taskTitle':taskTitle,
            'taskProject': taskProject,
            'taskPriority': taskPriority,
            'taskDate': taskDate
        });
        xhr.open('post', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(jsonTaskData);
        xhr.onreadystatechange = function () {
            var cancelButton;
            cancelButton = document.getElementById("cancelTaskFormButton");
            cancelButton.onclick = function () {
                xhr.abort();
            };
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                hideTaskEditForm();
                window.oldTaskTitle = "null";
            }
        }
    }
}


function setDoneTask(element, url) {
    var task_done_buttons, position, task_row, taskTitle, jsonResponse;
    task_done_buttons = document.getElementsByClassName('task_done_button');
    position = getPosition(element, task_done_buttons);
    task_row = document.getElementsByClassName('task_row')[position];
    taskTitle = task_row.children[1].textContent;
    console.log(taskTitle);
    xhr = new XMLHttpRequest();
    jsonTaskData = JSON.stringify({
        'taskTitle':taskTitle
    });
    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(jsonTaskData);
    xhr.onreadystatechange = function () {
        var cancelButton;
        cancelButton = document.getElementById("cancelTaskFormButton");
        cancelButton.onclick = function () {
            xhr.abort();
        };

        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            jsonResponse = JSON.parse(xhr.responseText);
            if(jsonResponse['taskCondition'] ==  0){
                console.log(jsonResponse['taskCondition'], jsonResponse['taskTitle'])
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
            var cancelButton;
            cancelButton = document.getElementById("cancelTaskFormButton");
            cancelButton.onclick = function () {
                xhr.abort();
            };
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                document.getElementById("defaultOpen").click();
                showHideProjectForm();
            }
        }
    }
}


function getTasks(evt ,headerTitle ,url) {
    var xhr, tasksJSON;
    switchSideBarButton(evt);
    document.getElementById('header_content').innerHTML = headerTitle;
    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            tasksJSON = xhr.response['tasks'];
            renderingTasks(tasksJSON);
        }
    };
    xhr.open('get', url, true);
    xhr.send();
}

function getProjectTasks(evt ,url, project) {
    document.getElementById('header_content').innerHTML = project;
    switchSideBarButton(evt);
    var xhr, tasksJSON;
    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            tasksJSON = xhr.response['tasks'];
            renderingTasks(tasksJSON);

        }
    };
    xhr.open('get', url +'?' + 'project=' + project, true);
    xhr.send();
}



function renderingTasks(tasksJSON) {
    var row, day, year, month, taskPriorityColor, taskDate, task_priority, task_title, task_project, task_date,
        task_color_project, rows, task_menu, edit_button, done_button, task_list;
    cleanTaskList();
    for (var t=0; t<tasksJSON.length; t++) {
        task_menu = document.createElement('div');
        task_list = document.getElementById('task_list');
        task_list.addEventListener('mouseleave', function (){
            hideMenuBtn(task_menu);
        });
        task_menu.setAttribute('class', 'task_menu');
        task_list.appendChild(task_menu);
        row = document.createElement('div');
        row.setAttribute('class', 'task_row');
        row.addEventListener('mouseover', function () {
                showHideTaskMenu(this);
            });
        task_list.appendChild(row);
    }
    rows = document.getElementsByClassName('task_row');
    for (var i = 0; i<rows.length; i++){
        taskDate = new Date();
        day = tasksJSON[i]['date']['day'];
        year = tasksJSON[i]['date']['year'];
        month = tasksJSON[i]['date']['month'];
        taskDate.setYear(year);
        taskDate.setMonth(month);
        taskDate.setDate(day);
        taskPriorityColor = setPriorityColor(tasksJSON[i]['priority'], taskDate);
        task_priority = document.createElement('div');
        task_priority.setAttribute('class', 'task_priority');
        task_priority.innerHTML = '<div class="square" style="background-color:' + taskPriorityColor + '; color:' + taskPriorityColor + '">' + tasksJSON[i]['priority'] + '</div>';
        rows[i].appendChild(task_priority);

        task_title = document.createElement('div');
        task_title.setAttribute('class', 'task_title');
        task_title.innerHTML = tasksJSON[i]['title'];
        rows[i].appendChild(task_title);

        task_project = document.createElement('div');
        task_project.setAttribute('class', 'task_project');
        task_project.innerHTML = tasksJSON[i]['project'];
        rows[i].appendChild(task_project);

        task_date = document.createElement('div');
        task_date.setAttribute('class', 'task_date');
        task_date.innerHTML = tasksJSON[i]['date'];
        rows[i].appendChild(task_date);

        task_color_project = document.createElement('div');
        task_color_project.setAttribute('class', 'task_color_project');
        task_color_project.innerHTML = '<div class="square" style="background-color:' + tasksJSON[i]['projectColor'] + '"></div>';
        rows[i].appendChild(task_color_project);
    }

    task_menu = document.getElementsByClassName('task_menu');
    for(var m=0; m < task_menu.length; m++){
        edit_button = document.createElement('button');
        edit_button.setAttribute('class', 'task_edit_button');
        edit_button.addEventListener("click", function(){
            showTaskEditForm(this);
        });
        edit_button.innerHTML = "Edit";
        task_menu[m].appendChild(edit_button);

        done_button = document.createElement('button');
        done_button.setAttribute('class', 'task_done_button');
        done_button.addEventListener("click", function(){
            setDoneTask(this, '/set_done_task/')
        });
        done_button.innerHTML = "Done";
        task_menu[m].appendChild(done_button);
    }
}
function showHideTaskMenu(element) {
    var task_rows, position, task_menu;
    task_menu = document.getElementsByClassName('task_menu');
    task_rows = document.getElementsByClassName('task_row');
    position = getPosition(element, task_rows);
    hideMenuBtn(task_menu);
    task_menu[position].style.display = "block";
}


function cleanTaskList() {
    var task_list;
    task_list = document.getElementById('task_list');
    while(task_list.firstChild) {
        task_list.removeChild(task_list.firstChild);
    }
}


function setPriorityColor(taskPriority, taskDate) {
    var priorityColor = {'3':'green', '2': 'orange', '1': 'red'};
    var today = new Date();
    if (today.getDate() > taskDate.getDate() || today.getYear() > taskDate.getYear() || today.getMonth() > taskDate.getMonth()) {
        return 'red'
    } else {
        return priorityColor[taskPriority]
    }
}
