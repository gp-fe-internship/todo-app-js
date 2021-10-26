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

    return listItem;
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