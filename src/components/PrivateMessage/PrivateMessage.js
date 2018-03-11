import React from 'react';
import { PropTypes } from 'prop-types';



class PrivateMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	pUserName: '', 
        	message: ''
        };
    }
    
    sendPrivate() {
    	if (this.state.pUserName.length != 0 && this.state.message.length != 0) {
    		const { socket } = this.context;
	    	socket.emit('privatemsg', { nick: this.state.pUserName, message: this.state.message }, (gotSent) => {
	            if (gotSent) {
	                console.log('user: ' + this.state.pUserName + ' got your message');
	            } else {
	                console.log('was not sent');
	            }
	        });
    	}
    }
    render() {

        return(
        	<div>
        		PrivateMessage
        		<input type="text"
        			placeholder="nick of receiver"
        			onInput={ (e) => this.setState({pUserName: e.target.value})} 
        		/>
        		<input type="text"
        			placeholder="This msg is private"
        			onInput={ (e) => this.setState({message: e.target.value})} 
        		/>
        		<button onClick = {() => this.sendPrivate()}>Send</button>
        	</div>
        );
    }
};

PrivateMessage.contextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
}

export default PrivateMessage;