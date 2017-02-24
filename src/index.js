import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ChatBot from './components/ChatBot.js';
injectTapEventPlugin();
ReactDOM.render(
	<MuiThemeProvider>
  		<ChatBot/>
  	</MuiThemeProvider>,
  document.getElementById('root')
);