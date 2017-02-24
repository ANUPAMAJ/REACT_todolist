import React from 'react';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import ajax from 'superagent';
import Notes from './Notes1.js'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class ChatBot extends React.Component {

// // componentDidMount(prevProps, prevState)
// //  {  
// //   var state={tasks:[],
// //             chatHistory:[{message:'hai',
// //                 response:'hello'}],                
// //                 value:''             
// //               } 
// //   localStorage.setItem('state', JSON.stringify(this.state));
// //  }
// //  state={chatHistory:[{message:'hai',
// //                 response:'hello'}],
// //                 tasks:[],
// //                 value:''             
// //               } 
// //  state = JSON.parse(localStorage.state);

componentDidMount()
 {  
    this.setState({chatHistory: JSON.parse(localStorage.getItem('chatHistory'))||[],
      tasks: JSON.parse(localStorage.getItem('tasks'))||[]});
    console.log(JSON.parse(localStorage.getItem('chatHistory')));
    console.log(this.state.chatHistory)
 }
  constructor(props) {
    super(props);
     this.state={
                chatHistory:[],
                tasks:[],
                value:'',
                valueList:'',             
              } 
    this.addTask = this.addTask.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.ajaxCall=this.ajaxCall.bind(this);
  }
 
  addTask(val){
    var lists = JSON.parse(localStorage.getItem('tasks'))||[];
    var obj = {task:val,checked:false}
    lists.push(obj);
    localStorage.setItem('tasks',JSON.stringify(lists));
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
  storeInLocalStorage(newChat){
    console.log(newChat)
    var chatHistory=JSON.parse(localStorage.getItem('chatHistory'))||[];
    chatHistory.push(newChat);
    localStorage.setItem('chatHistory',JSON.stringify(chatHistory));
    this.setState({chatHistory});
    console.log(this.state.chatHistory)
  }
  handleChangeList(e){
    var input = e.target.value;
    this.setState({valueList:input});
    }
  handleSubmitList(e){
    e.preventDefault();
    this.addTask(this.state.valueList);
    this.setState({valueList:''});
  }
  ajaxCall(){
    var history = this.state.chatHistory;
    var message = this.state.value;
    this.setState({value:''});
    let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/17070523-6fe8-413c-a7cc-c0ec4019d49c?subscription-key=d2f3437984c34969a91c8f8272fc489a&q="+this.state.value+"&verbose=true";
    ajax.get(url).end((error,response)=>{
        if(response)
        {
          if(response.body.topScoringIntent.intent === "None")
          {
            this.storeInLocalStorage({message:message,response:'Oops!I did not get you!'});    
            console.log("AAAA")
          }
          if(response.body.topScoringIntent.intent === "create note")
          {
           if(response.body.dialog.status==="Finished")
            {        
              this.storeInLocalStorage({message:message,response:'Created!Enter the tasks'});
              
            }
            if(response.body.dialog.prompt==="what?")
            {        
              this.storeInLocalStorage({message:message,response:'Oops!What is it?!'})            
               
            } 
          }
          if(response.body.topScoringIntent.intent === "status")
          {
            if(response.body.dialog.status==="Finished")
            {        
              this.storeInLocalStorage({message:message,response:'That was awesome'})            
               
            }
          }
          if(response.body.topScoringIntent.intent === "shownote")
          {
            if(response.body.dialog.status==="Finished")
            {        
              
              
              this.storeInLocalStorage({message:message,response:this.state.tasks});            
               
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
    const chatlist = this.state.chatHistory.map((item,i)=>{
      if(typeof item.response === 'string')
      {
        return(
          <div key={i}>                
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
      }
      else{
        return(
          <div key={i}>                
             <List>
               <Paper style={{background:'#AED581'}}>
               <ListItem
                primaryText={item.message}/>
                </Paper>
              <br/> 
              <Paper style={{width:350}}>
                <Notes tasks={item.response} handleChecked={this.handleChecked.bind(this)} addTask={this.addTask}/>
              </Paper>
              <br/>                    
            </List>                
          </div>
       );
      }
      
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