import './App.css';
import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id:null,
        title:"",
        completed:false,
      },
      editing:false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.startEdit = this.startEdit.bind(this)


  };

  componentWillMount(){
    this.fetchTasks()
  }

  fetchTasks(){
    console.log('Fetching.......')
    fetch("http://127.0.0.1:8000/api/task-list/")
    .then(response => response.json())
    .then(data => 
      this.setState({
        todoList:data
      })
      )
  }


  handleChange(e){
    var name = e.target.name 
    var value = e.target.value
    console.log('Name:',name)
    console.log('Value:',value)
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

   handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)



    var url = 'http://127.0.0.1:8000/api/task-create/'

    if(this.state.editing === true){
      url =  `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)  => {
        this.fetchTasks()
        this.setState({
           activeItem:{
          id:null, 
          title:'',
          completed:false,
        }
        })
    }).catch(function(error){
      console.log('ERROR:', error)
    })

  }
  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true,
    })
  }

  deleteItem(task){
    
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
      },
    }).then((response) =>{

      this.fetchTasks()
    })
  }

  render(){
    var tasks = this.state.todoList
    var self = this
    return(
      <div className="container">

          <div id="task-container">
          <form onSubmit={this.handleSubmit} id="form">
              <div  id="form-wrapper">
    
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handleChange} className="form-control" type="text" value={this.state.activeItem.title} name="title" placeholder="Add task.." />
                        </div>

                         <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
            
             
              </div>
              </form>

              <div  id="list-wrapper">    
              {tasks.map(function(task, index){
                      return(
                          <div key={index} className="task-wrapper flex-wrapper">

                            <div style={{flex:7}}>

                                <span> {task.title} </span>
  
                            </div>

                            <div style={{flex:1}}>
                                <button  onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                            </div>

                          </div>
                        )
                    })}     
              
              </div>
          </div>
          
        </div>

      )
  }
}

export default App;
