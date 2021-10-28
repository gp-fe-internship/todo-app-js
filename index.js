const TODO_LOCALSTORAGE_KEY = 'todos';

const addButton = document.querySelector('#todo-add');
const todoInputElement = document.querySelector('#todo-input');
const todoListElement = document.querySelector('#todolist');
const todoInputCountPlaceholder = document.querySelector('#input-count');
const todoListTotalCount = document.querySelector('#total')

todoInputElement.addEventListener('keyup', handleInputChange);
addButton.addEventListener('click', handleAddButtonClick);
todoListElement.addEventListener('click', handleListItemClick)

function handleInputChange(event) {
    handleInputCountUpdate(handleInputCount(event.target.value))
}

function handleInputCount(inputValue) {
    return inputValue.length;
}

function handleInputCountUpdate(value) {

    if (value === 0) {
        todoInputCountPlaceholder.innerText = '';
        return;
    }

    todoInputCountPlaceholder.innerText = `Characters count: ${value}`;
}

function handleAddButtonClick() {

    const inputValue = todoInputElement.value;

    if (!inputValue) {
        return;
    }

    todoListElement.appendChild(createListItem(inputValue));
    clearInput();
    countTotalTasks();
}

function createListItem(value) {

    if (!value) {
        return;
    }

    const listItem = document.createElement('li');

    const checkBoxElement = document.createElement('input');
    checkBoxElement.type = 'checkbox';
    checkBoxElement.setAttribute('data-action', 'complete')

    const removeItemButton = document.createElement('button');
    removeItemButton.innerText = 'X';
    removeItemButton.setAttribute('data-action', 'remove');

    const spanElement = document.createElement('span');
    spanElement.innerText = value;


    listItem.classList.add('todolist__item');
    listItem.appendChild(checkBoxElement);
    listItem.appendChild(spanElement);
    listItem.appendChild(removeItemButton);

    const todoId = crypto.randomUUID();
    listItem.setAttribute('data-todo-id', todoId);


    // LocalStorage logic
    const todos = getTodosFromLocalStorage();
    todos.push({
        id: todoId,
        text: value,
        complete: false,
    })
    setTodosToLocalStorage(todos);

    return listItem;
}


function renderTodoItem(todo) {
    const { id, text, complete } = todo;

    const listItem = document.createElement('li');

    const checkBoxElement = document.createElement('input');
    checkBoxElement.type = 'checkbox';
    checkBoxElement.setAttribute('data-action', 'complete')

    const removeItemButton = document.createElement('button');
    removeItemButton.innerText = 'X';
    removeItemButton.setAttribute('data-action', 'remove');

    const spanElement = document.createElement('span');
    spanElement.innerText = text;


    listItem.classList.add('todolist__item');
    if (complete) {
        listItem.classList.add('complete');
    }
    listItem.appendChild(checkBoxElement);
    listItem.appendChild(spanElement);
    listItem.appendChild(removeItemButton);

    listItem.setAttribute('data-todo-id', id);
    todoListElement.appendChild(listItem);
}



function clearInput() {
    todoInputElement.value = '';
    todoInputCountPlaceholder.innerText = '';
}

function countTotalTasks() {
    todoListTotalCount.innerText = `Total tasks: ${todoListElement.childElementCount}`
}

function handleListItemClick(event) {
  if (event.target.dataset.action === 'remove') {
    event.target.closest('li').remove();
  }
  if (event.target.dataset.action === 'complete') {
    event.target.closest('li').classList.toggle('complete');
  }
}



function setTodosToLocalStorage (todos = []) {
    localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(todos));
    
}

function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem(TODO_LOCALSTORAGE_KEY));
}

const todos = getTodosFromLocalStorage();

if (!todos || !todos.length) {
    console.log('empty storage')
    setTodosToLocalStorage();
} else {
    console.log('render todos')
    todos.map((todo) => renderTodoItem(todo));
}

/**
 * 1. Page reload
 *  - Check localstorage for todo's
 *  - If there are no todos do nothing
 *  - If there are todos, iterate and render items based on data
 * 2. Create todo
 *  - Read localstorage data (transform array)
 *  - Get data for new item id
 *  - Push data to array (todos)
 *  - Save data to localStorage
 * 3. Edit todo
 *  - Read localStorage data (todos)
 *  - Find in todos, edited element and update it
 *  - Save data to localStorage (todos)
 * 4. Remove todo
 *  - Read localStorage data (todos)
 *  - Filter out element from todos that matches remove item id
 *  - Save data to localStorage (todos)
 * 5. Fix bug with checkbox
 */