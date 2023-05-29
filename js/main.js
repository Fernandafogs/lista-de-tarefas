//esta const Main é a principal variavel e as funções estão organizadas dentro dela
const Main = {

  tasks: [],//nestes []são armazenadas as informações coleetadas pelo getStorage
//Os nomes init, cacheSelector e bindEvents foram criados e não são estruturais
//init é o início de tudo. Deve chamar todas as principais funções que serão trabalhadas dentro do Main
/*para a função ler uma informação que vem depois dela. Como por exemplo  o "cacheSelectors", ela usa o this. O this diz que aquela informação se encontra dentro do pai daquela função. No caso dentro do Main.*/
  init: function() {
    this.cacheSelectors()//função responsável por selecionar os dados do html e armazenar em uma variável
    this.bindEvents()//tem o objetivo de organizar/compilar todos os eventos das funções.
    this.getStoraged()//função para obter todas as informações que serão armazenadas
    this.buildTasks()//função que vais armazenar e organizar a lista de tarefas obtidas através do getStoraged
  },
//O this neste caso, faz com que cada variavel de seleção funcione em todas as outras funções no Main.
//Boa prática do mercado é colocar $ no início das variaveis que declaram informações do html
  cacheSelectors: function() {
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

   /*IMPORTANTE: dentro de uma função de evento (keypress, onclick, mousemove...), o this sempre será o próprio elemento que adicionou ao evento. Por este no motivo no bind events desta função é colocado .bind(this) no final*/
//bindEvents ficará responsável por adicionar eventos nos itens selecionados do html, como por exemplo adicionar evento de click, enter...
  bindEvents: function() {
    const self = this//é necessário declarar uma variavel para this, pois existem vezes que o this não considera a função principal como pai e é necessário chamar através da variavel, principalmente nos casos de eventos.
//Como existem varios buttons, é necessário colocar o forEach (para funcionar em cada botão)
    this.$checkButtons.forEach(function(button){
      button.onclick = self.Events.checkButton_click.bind(self)
    })
/*sempre que se trabalha com o this em uma função é importante utilizar o console.log (this)para verificar que ele está vendo como pai. Neste caso do button.onclick foi necessário criar uma "const self=this", para chamar o this, pois se colocassemos "button.onclick = this.checkButton_click", consideraria o Window ao invés do Main como pai.*/
    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)
    //input tarefas - usa onkeypress para mostrar que ao apertar uma tecla
    //foi colocado o .bind(this) no final para chamar a função. Porque no evento não era possível.

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click.bind(self)
    })//neste caso não conseguimos colocar o bind(this)porque ele consideraria o pai como o function button e não o bindEvents. Por este motivo foi chamado a variavel self, que acima é declarada =this.
  },

  getStoraged: function() {
    const tasks = localStorage.getItem('tasks')//variavel em que as informações obtidas são armazenadas e colocadas em []

// if para checar caso ainda não tenha nada no localStorage então devemos salvar um array vazio
    if (tasks) {
      this.tasks = JSON.parse(tasks)//this.tasks se refere a variavel inicial no começo do código que é =[], as tasks nos () são as informações coletadas na const tasks. Basicamente as informações coletadas no getItem são transformadas em objeto JSON e armazenadas na this.tasks dentro de []
      
    } else {
      localStorage.setItem('tasks', JSON.stringify([]))
    }
  },
/*como essa estrutura do HTML será utilizada mais de uma vez, foi criada uma função com a estrutura html, de forma que poderá ser trabalhada mais de uma vez sem ser clonada.*/
  getTaskHtml: function(task, isDone) {
    return `
      <li class="${isDone ? 'done' : ''}" data-task="${task}">          
        <div class="check" ></div>
        <label class="task">
          ${task}
        </label>
        <button class="remove"></button>
      </li>
    `
    //quando colocamos data-... Conseguimos colocar um parametro no html que poderá ser trabalhado no Javascript.
    //mesma estrutura do html com a adição da variável
  },

  insertHTML: function(element, htmlString) {
    element.innerHTML += htmlString

    this.cacheSelectors() //passar a adicionar novamente
    this.bindEvents() //passar a adicionar novamente
    /*depois de adicionar a informação do HTML ou modificar a árvore do HTML é importante chamar novamente as funções dos eventos. Neste caso o cacheSelectors e o bindEvents*/
  },

  buildTasks: function() {
    let html = '' 


    this.tasks.forEach(item => {
      html += this.getTaskHtml(item.task, item.done)
    })

    this.insertHTML(this.$list, html)
  },
//Events tem o objetivo de organizar/compilar todos os eventos das funções.
  Events: {
    checkButton_click: function(e) {
      const li = e.target.parentElement
      const value = li.dataset['task']
      const isDone = li.classList.contains('done')
      

      const newTasksState = this.tasks.map(item => {
        if (item.task === value) {
          item.done = !isDone
        }

        return item
      })
/*salvando as informações da lista de tarefas inputadas. Key é tasks e o value as tarefas listadas em JSON. NewTasksState é o nosso objeto em formato JSON*/
      localStorage.setItem('tasks', JSON.stringify(newTasksState))

      if (!isDone) {
        return li.classList.add('done')       
      }

      li.classList.remove('done')
        /* mesma coisa que 
            if (isDone){
                li.classList.remove('done')
            }else{
                li.classList.add('done')
    }*/
  },

   
    inputTask_keypress: function(e){      
      const key = e.key /*e de evento e key de tecla apertada. Inclusive no if colocamos key === Enter, porque é a tecla que nos interessa*/
      const value = e.target.value
      const isDone = false

      if (key === 'Enter') {
        const taskHtml = this.getTaskHtml(value, isDone)

        this.insertHTML(this.$list, taskHtml)

        e.target.value = '' //faz com que limpe o espaço de input após o enter e a tarefa ir para a lista
 
//criar uma variavel para salvar as informações GetItem
//depois criar uma variavel já transformando em JSON
        const savedTasks = localStorage.getItem('tasks')
        const savedTasksArr = JSON.parse(savedTasks)        
/*a variável savedTasks tem as tarefas obtidas pelo getItem e na variavel savedTasksArr as tarefas se tornam objeto em formato JSON*/

        const arrTasks = [
          { task: value, done: isDone },
          ...savedTasksArr,
        ]
/*Nesta função consta o objeto salvo(informações obtidas pelo getItem e transformadas em objeto JSON) e tem o ... que se chama spread operator, ele faz com que o objeto como um [] ou "" seja expandido em vários elementos individuais*/
        const jsonTasks = JSON.stringify(arrTasks)

        this.tasks = arrTasks
        localStorage.setItem('tasks', jsonTasks)
      }
    },
//funcão de evento para remover da lista.
//Quando adicionamos uma task nova estamos atualizando somente no localStorage, mas devemos atualizar no this.tasks conforme acima

/*A função abaixo será responsável por procurar a informação que deve ser removida dentro do [], remover e salvar.*/
    removeButton_click: function(e){
      const li = e.target.parentElement//verificar as informações que nós temos dentro da li
      const value = li.dataset['task']  //procurar esta informação dentro do [tasks]. 
      //Dataset é um recurso que permite acessar dados html e modificar no Javascript
      
      console.log(this.tasks)
/*a variavel abaixo vai filtrar e vai selecionar os itens que são diferentes da variavel value. O item é um objeto que tem uma propriedade task lá dentro */
      const newTasksState = this.tasks.filter(item => {
        console.log(item.task, value)
        return  item.task !== value
      })
//Serão armazenados as informações diferentes de value. No caso as informações que não foram removidas
//quando removemos uma task (atualmente removemos ela somente do localStorage) precisamos atualizar nosso state do objeto, o this.tasks
      localStorage.setItem('tasks', JSON.stringify(newTasksState))
      this.tasks = newTasksState

// o item selecionado será removido.
      li.classList.add('removed')

/*foi criado no CSS uma animação removed que tem duração e depois dela entra hidden que é display none, ou seja, desaparece como excluido/ocultado da lista após 300ms*/
      setTimeout(function(){
        li.classList.add('hidden')
      },300)
    }
  }

}

Main.init()

