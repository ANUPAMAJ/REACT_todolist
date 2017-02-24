import React from 'react';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import ajax from 'superagent';
import Notes from './Notes.js'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
export default class ChatBot extends React.Component {
  constructor(props) {
    super(props);
    this.state={chathistory:[{message:'hai',
                response:'hello'}],
                tasks:[],
                value:'',             
              };
    this.addTask = this.addTask.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.ajaxCall=this.ajaxCall.bind(this);
  }
  addTask(val){
    var lists = this.state.tasks;
    var obj = {task:val,checked:false}
    lists.push(obj);
    this.setState({tasks:lists});
  }
  handleChecked(i){
    var lists = this.state.tasks;
    var obj = lists[i];
    obj.checked = !obj.checked;
    console.log(obj);
    lists.splice(i,1,obj);
    this.setState({tasks: lists})
  }
  handleChange(event){
    var newmessage = event.target.value;
    this.setState({value:newmessage})
  }
  ajaxCall(){
    var history = this.state.chathistory;
    var message = this.state.value;
    this.setState({value:''});
    let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/17070523-6fe8-413c-a7cc-c0ec4019d49c?subscription-key=d2f3437984c34969a91c8f8272fc489a&q="+this.state.value+"&verbose=true";
    ajax.get(url).end((error,response)=>{
        if(response)
        {
          if(response.body.topScoringIntent.intent === "None")
          {
            history.push({message:message,response:'Oops!I did not get you!'})            
            this.setState({chathistory:history}); 
          }
          if(response.body.topScoringIntent.intent === "create note")
          {
           if(response.body.dialog.status==="Finished")
            {        
              history.push({message:message,response:'Created!Enter the tasks'});
              this.setState({chathistory:history});
            }
            if(response.body.dialog.prompt==="what?")
            {        
              history.push({message:message,response:'Oops!What is it?!'})            
              this.setState({chathistory:history}); 
            } 
          }
          if(response.body.topScoringIntent.intent === "status")
          {
            if(response.body.dialog.status==="Finished")
            {        
              history.push({message:message,response:'That was awesome'})            
              this.setState({chathistory:history}); 
            }
          }
          if(response.body.topScoringIntent.intent === "shownote")
          {
            if(response.body.dialog.status==="Finished")
            {        
              const notelist = <Notes handleChecked={this.handleChecked.bind(this)} tasks={this.state.tasks} addTask={this.addTask}/>
              history.push({message:message,response:notelist})            
              this.setState({chathistory:history}); 
            }
          }       
        }
        else
        {
          console.log("Oops! Something went wrong!Error fetching from API");
        }
    });
  }
  render() {
    const chatlist = this.state.chathistory.map((item,i)=>{
      return(
          <div  key={i}>                
             <List>
               <Paper style={{background:'#AED581'}}>
               <ListItem
                primaryText={item.message}/>
                </Paper>
              <br/> 
              <Paper style={{background:'#F1F8E9'}}>                   
              <ListItem
                primaryText={item.response}/>
              </Paper>
              <br/>                    
            </List>                
          </div>
       );
    });
    return (<div>
              <Paper style={{width:600}}>
              <AppBar style={{background:'#1B5E20'}}
                  title="ChatBot"
                  iconClassNameRight="muidocs-icon-navigation-expand-more"
                />
                <div>{chatlist}</div>
                <br/>
                <br/>
                <div>
                  <TextField  style={{width:500,padding:10}} hintText="Type Your Message" value={this.state.value} onChange={this.handleChange}/>
                  <RaisedButton label="SEND" primary={true} onClick={this.ajaxCall}/>
                </div>
              </Paper>
            </div>);
  }
}