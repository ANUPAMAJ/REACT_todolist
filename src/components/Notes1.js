import React,{ Component} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
export default class Notes extends Component{
  constructor(props){
      super(props);
      this.state={
                value:'',             
              };
    }
  handleChange(e){
    var input = e.target.value;
    this.setState({value:input});
    }
  handleSubmit(e){
    e.preventDefault();
    this.props.addTask(this.state.value);
    this.setState({value:''});
  }
  render(){
    const tasks = this.props.tasks.map((item,i)=>{
      const style = {
        textDecoration: item.checked ? 'line-through' : 'none'
      }
      return(
        <div key={i}>
          <ListItem style={style} leftCheckbox={<Checkbox checked={item.checked} onCheck={this.props.handleChecked.bind(this,i)}/>} primaryText={item.task}/>
        </div>
        );
    });
    return(
       <div>
         <Paper style={{width:350}}>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <TextField  style={{width:300,padding:10}} hintText="Enter your tasks" value={this.state.value} onChange={this.handleChange.bind(this)}/>
              </form>
          <List>
              <Subheader>My Sticky Notes</Subheader>
              {tasks}
            </List>
       </Paper>
       </div>
    );
  }
}