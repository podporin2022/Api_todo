class Todo {
    static  url = 'todos';
    #todos = [];
    #currentTodo = null;
    #EtodoContainer = null;
    #currentTodoE = null;
    #http = null;
    #editE = null;
    #editTitle = null;
    #editBody = null;
    #CLASSES = {
        todoComplete: 'todo-complete',
        hideButton: 'hide-element',
        closeTodo: 'close',
        completeTodo: 'complete',
        itemTitle: 'item-title',
        itemBody: 'item-body',
        show:'show',
        activeList: 'active-list',
    }
    constructor(el, editEl) {
        this.#EtodoContainer = el;
        this.#editE = editEl;

        this.init();
        console.log(this.#http);

    }
    init(){
        this.#http = new Http(Todo.url);
        this.#editTitle = this.#editE.querySelector('.edit-title');
        this.#editBody = this.#editE.querySelector('.edit-body');
        this.addListeners();
        this.getTodos();
    }
    addListeners(){
        this.#EtodoContainer.addEventListener('click', this.todoClick);
        this.#editE.querySelector('.save-btn').addEventListener('click', this.onSave);
    }
    // Получение всех ТУДУШЕК
    getTodos() {
        this.#http.getAll().then((d) => {
            this.#todos = d;
            this.renderTodos(this.#todos.reverse());
        });
    }
    renderTodos(todos) {
        const content = todos.map((t) => this.createTodoElement(t)).join('');
    console.log(todos)
        this.#EtodoContainer.innerHTML = content;

    }
// создание структуры ТУДУШКИ
    createTodoElement(todo) {
        return ` 
                   <div class="item ${todo.isComplete ? this.#CLASSES.todoComplete : ''}" id="${todo.id}">
                    <div class="item-content">
                        <div>
                            <div class="item-title">Title: ${todo.title}</div>
                            <div class="item-body">Body: ${todo.body}</div>
                        </div>
                        <div class="time">${this.setFormatDate(todo.createDate)}</div>
                        <div class="item-actions">
                            <div class="close">X</div>
                            <div class="complete ${todo.isComplete ? this.#CLASSES.hideButton: ''}">Complete</div>
                        </div>
                    </div>
                </div> `;
    }
    // вешаем клики на все нужные елементы
    todoClick = (e) =>{
        if(this.#currentTodoE){
            this.#currentTodoE.classList.remove(this.#CLASSES.activeList);
        }
        const target = e.target;
        this.#currentTodoE = e.target.closest('.item');
        console.log(this.#currentTodoE)

        if (this.#currentTodoE){
            this.#currentTodo = this.#todos.find(
                (e) => e.id === this.#currentTodoE.id);
        }
        if (e.target.classList.contains(this.#CLASSES.closeTodo)){
            console.log('DELETE');
            this.closeTodo(this.#currentTodo.id);

            return
        }
        if (e.target.classList.contains(this.#CLASSES.completeTodo) ){

            this.completeTodo(this.#currentTodo);
            // this.#currentTodoE.classList.add(this.#CLASSES.hideButton)  ;
            console.log('COMPLETE');
            return
        }
        if (e.target.classList.contains(this.#CLASSES.itemTitle ) ||
            e.target.classList.contains(this.#CLASSES.itemBody )){
            this.#currentTodoE.classList.add(this.#CLASSES.activeList);
            this.editTodo();
        }
    }
// Удаление туду
    closeTodo(id) {
        this.#http.deleteTodo(id).then((r) => {
            if (r.deletedCount >=1) {
                this.#todos = this.#todos.filter(t=> t.id !== id);
                this.#currentTodoE.remove(this.#CLASSES.activeList);
                this.clearData();
            }
        });
    }
    completeTodo(todo){
        todo.isComplete = true;
        this.#http.update(todo.id, todo).then((r) => {
            if (r && r.id) {
                this.#currentTodoE.classList.add(this.#CLASSES.todoComplete);
                this.clearData();
            }
            this.getTodos()
        });
    }
    editTodo() {
        this.#editE.classList.add(this.#CLASSES.show);
        this.#editTitle.value = this.#currentTodo.title;
        this.#editBody.value = this.#currentTodo.body;
    }
    onSave = () =>{
        this.#currentTodo.title = this.#editTitle.value;
        this.#currentTodo.body = this.#editBody.value;
        this.#http.update(this.#currentTodo.id, this.#currentTodo).then((r) =>{
            // if( r && r.id){
                // console.log(r)
                this.#currentTodoE.querySelector('.item-title').innerHTML = r.title;
                this.#currentTodoE.querySelector('.item-body').innerHTML = r.body;
                this.#editE.classList.remove(this.#CLASSES.show);
                this.#currentTodoE.classList.remove(this.#CLASSES.activeList);
                this.getTodos()
                this.clearData();

            // }
        });
    }
// создание новой ТУДУ
    createTodo(title, body) {
        const todo = {
            title,
            body,
            isComplete:false,
        };

        //Сначала делаем  проверку на заполненность форм и если что-то не заполнено, тогда alert,
        //В противном случае (если не сработал первый if) мы добавляем элемент

        if ( !title.trim() || !body.trim()){
            alert('Error! Please fill in all the fields');
        } else {
            this.#http.create(todo).then(r => {

            this.#todos.unshift(r);
            if (r && r.id) {
                const content = this.createTodoElement(r);
                this.#EtodoContainer.insertAdjacentHTML('afterbegin', content);
            }
        });
            titleE.value = "";
            bodyE.value = "";}


    }
    clearData(){
        this.#currentTodo = null;
        this.#currentTodoE = null;
    }
    setFormatDate(todoDate){
        const date = new Date(Date.parse(todoDate));
        const dd = date.getDate();
        const mm = date.getMonth();
        const yyyy = date.getFullYear();
        return `${dd}.${mm}.${yyyy}`
    }
}