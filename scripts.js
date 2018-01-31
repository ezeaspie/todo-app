//Data Stuff

const projectFactory  = (name, desc) => {
  let todoArray = [];
  const addTodo = (todoItem) => todoArray.push(todoItem);
  const removeTodo = (index) => todoArray.splice(index, 1);
  return {name,desc,addTodo,removeTodo,todoArray};
};

const todoFactory = (name, desc, due, priority, isComplete) => {
  const toggleIsComplete = () => {
    isComplete = !isComplete;
    }
  return {name,desc,due,priority,toggleIsComplete,isComplete}
};


const inputValidationOnSubmit = (selector) => {
    $(selector + ' input').each(function() {
      if ($(this).val() == '') {
        $(this).addClass('highlight');
      }
      else{
        $(this).removeClass('highlight');
      }
    });
    if ($(selector + ' input').hasClass('highlight')) {
      alert("Please fill in all the required fields (indicated by *)");
      return false;
    }
    else {
      return true;
    }
  }
const clearInputOnSubmit = (selector) => {
  $(selector + ' .main').each(function() {
    $(this).val('');
  });
}
//DOM Stuff

const renderProjects = (array) => {
  let html = '';
  for (let i=0 ; i<array.length ; i++) {
    html += `
    <div class="project" data-projectId="${i}">
      <h2>${projectArray[i].name}</h2>
      <h3>${projectArray[i].desc}</h3>
      <form class="addNewTodo" id="addNewTodo${i}" data-projectId="${i}">
        <label>Todo Name:</label>
        <input class="main" type="text" id="todoName${i}"></input>
        <label>Description:</label>
        <input class="main" type="text" id="todoDesc${i}"></input>
        <label>Due Date:</label>
        <input class="main" type="Date" id="todoDueDate${i}"></input>
        <label>Priority:</label>
          <input type="radio" id="p1" name="priority${i}" checked = "checked" value="1" />
          <label for="p1">Low</label>
          <input type="radio" id="p2" name="priority${i}" value="2" />
          <label for="p2">Medium</label>
          <input type="radio" id="p3" name="priority${i}" value="3" />
          <label for="p2">High</label>
        <input id="submitTodo${i}" type="submit" value="Add Item"></input>
      </form>
      <ul id="todoList${i}" data-projectId=${i}>
      </ul>
    </div>`
  }
  document.querySelector("#projectList").innerHTML = html;
}

const renderTodos = (array, projectId) => {
  let html = '';
  for (let i=0 ; i<array.length ; i++) {
    html += `
    <div class="todo priority${array[i].priority}">
      <h3>${array[i].name}</h3>
      <p>${array[i].desc}</p>
      <p>${array[i].due}</p>
      <button class="toggle" data-projectId = ${projectId} data-taskId = ${i}>Complete</button>
      <button class="remove" data-projectId = ${projectId} data-taskId = ${i}>Delete</button>
    </div>
    `
  }
  document.querySelector("#todoList" + projectId).innerHTML = html;
}

const projectArray = [];

document.querySelector("#addNewProject").addEventListener('submit', function(e) {
  e.preventDefault();
  if(inputValidationOnSubmit('#addNewProject')){
    let projectName = document.querySelector("#projectName").value;
    let projectDesc = document.querySelector("#projectDesc").value;
    projectArray.push(projectFactory(projectName,projectDesc));
    renderProjects(projectArray);
    for (currentId = 0 ; currentId < projectArray.length ; currentId++){
      renderTodos(projectArray[currentId].todoArray , currentId);
    }
    clearInputOnSubmit("#addNewProject");
  }
});

$(document).on('submit', '.addNewTodo', function(e) {
  e.preventDefault();
  let currentId = $(this).attr('data-projectId');
  console.log(currentId);
  if(inputValidationOnSubmit("#addNewTodo" + currentId)){
    let todoName = document.querySelector("#todoName" + currentId).value;
    let todoDesc = document.querySelector("#todoDesc" + currentId).value;
    let todoDueDate = document.querySelector("#todoDueDate" + currentId).value;
    let todoPriority = $('input[name="priority' + currentId + '"]:checked').val();
    todoPriority = Number(todoPriority);
    console.log(todoPriority);
    let newtodoItem = todoFactory(todoName,todoDesc,todoDueDate,todoPriority, false);
    projectArray[currentId].addTodo(newtodoItem);
    console.log(projectArray);
    renderTodos(projectArray[currentId].todoArray , currentId);
    clearInputOnSubmit('#addNewTodo' + currentId);
  }
});

$(document).on('click', '.toggle', function() {
  let project = $(this).attr("data-projectId");
  let task = $(this).attr("data-taskId");
  //This should work via a method created in the TodoFactory but for some reason it doesn't.
  projectArray[project].todoArray[task].isComplete = !projectArray[project].todoArray[task].isComplete;
  console.log(projectArray[project].todoArray[task].isComplete);
});

$(document).on('click', '.remove', function() {
  let project = $(this).attr("data-projectId");
  let task = $(this).attr("data-taskId");
  //This should work via a method created in the TodoFactory but for some reason it doesn't.
  projectArray[project].removeTodo(task);
  console.log(projectArray[project].todoArray);
  renderTodos(projectArray[project].todoArray , project);
});
