class Http {
    #endpoint = 'http://nestapi-env.eba-9kgvuxij.eu-central-1.elasticbeanstalk.com/todos';
    getAll() {
       return  fetch(this.#endpoint).then((r) => r.json());
    }
    getById(id) {
      return   fetch(this.#endpoint +'/' + id);
    }
    update(id, item){
     return fetch(`${this.#endpoint}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
        });
    }
    deleteTodo(id) {
        return fetch(this.#endpoint + '/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
         }).then((r) => r.json());
    }
    create(item) {
        return fetch(this.#endpoint , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        }).then((r) => r.json());
    }
}