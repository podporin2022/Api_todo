const todo = new Todo(
    document.querySelector('.list'),
    document.querySelector('.edit-container'));
const header = document.querySelector('.header');
//Отменяем дефолтное поведение кнопки


const titleE = document.querySelector('.title');
const bodyE = document.querySelector('.body');
document.querySelector('.create')
    .addEventListener('click', () => todo.createTodo(titleE.value, bodyE.value));


