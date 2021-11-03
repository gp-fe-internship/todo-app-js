const TODO_LOCALSTORAGE_KEY = 'todos';

const addButton = document.querySelector('#todo-add');
const todoInputElement = document.querySelector('#todo-input');
const todoListElement = document.querySelector('#todolist');
const todoInputCountPlaceholder = document.querySelector('#input-count');
const todoListTotalCount = document.querySelector('#total')
const todoListTotalDoneCount = document.querySelector('#total-done');

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
    todos = getTodosFromLocalStorage()
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
    let todos = getTodosFromLocalStorage();
    todos.push({
        id: todoId,
        text: value,
        complete: false,
    })
    setTodosToLocalStorage(todos);
    // todos = getTodosFromLocalStorage();
    return listItem;
}

function renderTodoItem(todo) {
    const { id, text, complete } = todo;

    const listItem = document.createElement('li');
    const checkBoxElement = document.createElement('input');
    checkBoxElement.type = 'checkbox';
    checkBoxElement.setAttribute('data-action', 'complete')
    checkBoxElement.checked = complete;

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
    countTotalTasks();
    countCompletedTasks();
}

function clearInput() {
    todoInputElement.value = '';
    todoInputCountPlaceholder.innerText = '';
}

function countTotalTasks() {
    todos = getTodosFromLocalStorage();
    if (todos.length) {
        todoListTotalCount.innerText = `Total tasks: ${todos.length}`
    } else {
        todoListTotalCount.innerText = '';
    }
}
// maybe there should be one function for counting everything and one for showing?
function countCompletedTasks() {

    let count = 0;

    const tasks = todoListElement.getElementsByTagName('li');
    //maybe there's a better way than iterating the entire list every time...
    for (const task of tasks) {
        if (task.className === 'todolist__item complete') {

            count++;
        }
    }

    if (count > 0) {
        todoListTotalDoneCount.innerText = `Total done: ${count} ${count > 1 ? 'tasks' : 'task'}`;
    } else {
        todoListTotalDoneCount.innerText = '';
    }
}

function handleListItemClick(event) {
    if (event.target.dataset.action === 'remove') {
        event.target.closest('li').remove();
        removeTodoFromLocalStorage(event);
        countCompletedTasks();
        countTotalTasks();
    }
    if (event.target.dataset.action === 'complete') {
        event.target.closest('li').classList.toggle('complete');
        countCompletedTasks();
        updateLocalStorageOnComplete(event);
    }
}

function setTodosToLocalStorage(todos = []) {
    localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem(TODO_LOCALSTORAGE_KEY)) || [];
}

function removeTodoFromLocalStorage(event) {
    const newTodos = getTodosFromLocalStorage().filter(todo => todo.id !== event.target.closest('li').dataset.todoId);
    setTodosToLocalStorage(newTodos)
}

function updateLocalStorageOnComplete(event) {
    let todoItems = getTodosFromLocalStorage() || [];
    todoItems = todoItems.map(todo => {
        if (todo.id === event.target.closest('li').dataset.todoId) {
            todo.complete = !todo.complete;
        }
        return todo;
    })
    setTodosToLocalStorage(todoItems)
}

let todos = getTodosFromLocalStorage();
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