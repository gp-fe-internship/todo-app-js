const addButton = document.querySelector('#todo-add');
const todoInputElement = document.querySelector('#todo-input');
const todoListElement = document.querySelector('#todolist');
const todoInputCountPlaceholder = document.querySelector('#input-count');

todoInputElement.addEventListener('keyup', handleInputChange);
addButton.addEventListener('click', handleAddButtonClick);


function handleInputChange(event) {
  handleInputCountUpdate(handleInputCount(event.target.value))
}

function handleInputCount(inputValue) {
  return inputValue.length;
}

function handleInputCountUpdate(value) {

  if(value === 0) {
    todoInputCountPlaceholder.innerText = '';
    return;
  }

  todoInputCountPlaceholder.innerText = `Characters count: ${value}`;
}

function handleAddButtonClick () {

  const inputValue = todoInputElement.value;
  
  if (!inputValue) {
    return;
  }

  todoListElement.appendChild(createListItem(inputValue)); 

}

function createListItem(value) {

  if(!value) {
    return;
  }

  const listItem = document.createElement('li');
  
  const checkBoxElement = document.createElement('input');
  checkBoxElement.type = 'checkbox';
  
  const removeItemButton = document.createElement('button');
  removeItemButton.innerText = 'X';

  const spanElement = document.createElement('span');
  spanElement.innerText = value;


  listItem.classList.add('todolist__item');
  listItem.appendChild(checkBoxElement);
  listItem.appendChild(spanElement);
  listItem.appendChild(removeItemButton);

  return listItem;
}