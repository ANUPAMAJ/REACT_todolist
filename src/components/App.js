import React,{ Component} from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Notes from './Notes.js';
export default class App extends Component{
  constructor(){
  	super();
  	this.state={
                create:true,
                description:'',                
              }
  }
  render(){
  	const style = {
	  width: 300,
	  padding:10,
	  textAlign: 'center',
	};
    return(
       <div>
	       <Paper style={{width:350}}>
		       <TextField style={style}
			      defaultValue={this.state.description}
			      floatingLabelText="Make a sticky note"
		    	/>
		    	<Notes/>
		    </Paper>
       </div>
    );
  }
}
