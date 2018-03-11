import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/Container/Container';
import Username from './components/Username/Username';
import '../styles/site.less';
import { PropTypes } from 'prop-types';
import socketClient from 'socket.io-client';
import ChatWindow from './components/ChatWindow/ChatWindow';


class App extends React.Component {

    componentDidMount() {
        this.getChildContext().socket.on('recv_privatemsg', (pun, pmsg) => {
            var pmes = 'Message from: ' + pun + ': ' + pmsg;
            alert(pmes);
        });
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    constructor(props) {
        super(props);
        const socket = socketClient('http://localhost:8080');
        this._socket = socket;
        

        this.state = {
            username: '', 
            currRoom: {}
        };
    }
    
    getUsername(un) {
        var self = this;
        this.getChildContext().socket.emit('adduser', un, function(available) {
            if (!available) {
                alert('Not available');
            } else {
                self.setState({
                    username: un,
                    currRoom: {}
                });
            }
        });
    }

    getChildContext() {
        return {
            user: {
                username: this.state.username
            },
            socket: this._socket
        }
    }

    chatRoomJoined(room) {
        console.log('RoomName: ' + room.id + ' joined!');
        const un = this.state.username;
        this.setState({
            username: un, 
            currRoom: room
        });

    }

    leaveRoom() {
        console.log('leaveRoom entered 63');
        const un = this.state.username;
        this.setState({
            username: un, 
            currRoom: {}
        });
    }

    render() {
        if (!(Object.keys(this.state.currRoom).length === 0 && this.state.currRoom.constructor === Object)) {
            console.log('joined the second');
            return(
                <div className="container">
                    <ChatWindow roomObject = { this.state.currRoom } leavingRoom = { this.leaveRoom.bind(this) } />
                </div>
            );
        } else if (this.getChildContext().user.username.length != 0) {
            console.log('joined the first');
            return (
                <Container getChatRoom = { this.chatRoomJoined.bind(this) } />
            );
        } else {
            console.log('joined the third');
            return (
                <div className="container">
                    <Username getUsername = { this.getUsername.bind(this) } />
                </div>
            );
        }
        
    }
}

App.childContextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
};

ReactDOM.render(<App />, document.getElementById('app'));
