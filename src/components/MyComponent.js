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
    console.log('va', this.state.value);
    let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6824a003-2485-4871-86d1-58e9d33b046a?subscription-key=d2f3437984c34969a91c8f8272fc489a&q="+this.state.value+"&verbose=true";
    ajax.get(url).end((error,response)=>{
      if(response){
        console.log('body', response.body);
        console.log('status', response.body.dialog.status);
        console.log('prompt', response.body.dialog.prompt);
        if(response.body.dialog.prompt==="when?"){
          this.setState({display:response.body.dialog.prompt});
        }
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
              <RaisedButton label="Go!" primary={true} onClick={this.ajaxCall}/><br/>
              {this.state.display}
            </div>);
  }
}