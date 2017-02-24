import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ajax from 'superagent';
export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state={
                value:'',
                display:''
              }
    this.handleChange=this.handleChange.bind(this);
    this.ajaxCall=this.ajaxCall.bind(this);
  }
  handleChange(e){
    this.setState({
      value:e.target.value
    })
  }
  ajaxCall(){
    console.log(this.state.value);
    let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/976f7fd6-6a76-46c0-9857-6fcc99a99d8b?subscription-key=efd01e4bf7dc443180fcf9145ec03a0b"+"&q="+this.state.value+"&verbose=true";
    ajax.get(url).end((error,response)=>{
      if(response){
        console.log(response.body);
        console.log(response.body.dialog.status);
        console.log(response.body.dialog.prompt);
        if(response.body.dialog.prompt==="about?"){
          this.setState({display:response.body.dialog.prompt});
        }
        if(response.body.dialog.prompt==="where?"){
          this.setState({display:response.body.dialog.prompt});
        }
        if(response.body.dialog.status==="Finished"){
          this.setState({display:"OK"});
        }
      }
      else {
        console.log("There was an error fetching from API");
      }
    });
  }
  render() {
    return (<div>
              <TextField hintText="Enter the word" value={this.state.value} onChange={this.handleChange}/>
              <RaisedButton label="search" primary={true} onClick={this.ajaxCall}/><br/>
              {this.state.display}
            </div>);
  }
}