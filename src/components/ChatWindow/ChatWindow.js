import React from 'react';
import { PropTypes } from 'prop-types';

class ChatWindow extends React.Component {
    componentDidMount() {

        const { socket } = this.context;
        socket.on('updatechat', (getRoomName, getmsg) => {
            let messages = Object.assign([], getmsg);
            this.setState({ messages });
        });
        socket.on('kicked', (kRoom, kUser) => {
            if (this.context.user.username == kUser) {
                this.leave();
                //leave
            }
        });
        socket.on('banned', (bRoom, bUser) => {
            if (this.context.user.username == bUser) {
                this.leave();
                //leave
            }
        });
        
    }

    constructor(props) {
        super(props);
        this.state = {
            msg: '', 
            messages: [], 
            userKick: '', 
            userBan: ''
        };
    }

    sendMessage() {
        const{ socket } = this.context;
        const rn = this.props.roomObject.id;
        const cmsg = this.state.msg;
        socket.emit('sendmsg', {roomName: rn, msg: cmsg});
        this.setState({ msg: ''});
    }

    kickUser(un) {
        if (un.length != 0) {
            const{ socket } = this.context;

            socket.emit('kick', { user: un, room: this.props.roomObject.id }, (gotKicked) => {
                if (gotKicked) {
                    console.log('user: ' + un + ' got kicked');
                } else {
                    console.log('was not kicked');
                }
            });
        }
    }

    banUser(un) {
        if (un.length != 0) {
            const{ socket } = this.context;

            socket.emit('ban', { user: un, room: this.props.roomObject.id }, (gotBanned) => {
                if (gotBanned) {
                    console.log('user: ' + un + ' got banned');
                } else {
                    console.log('was not banned');
                }
            });
        }
    }
    
    leave() {
        this.props.leavingRoom();
    }

    roomLeave() {

        const{ socket } = this.context;

        socket.emit('partroom', this.props.roomObject.id);
        this.leave();
    
    }

    render() {
        const { messages } = this.state;
        if (messages.length != 0) {
            console.log(messages[0].message + 'isMessage');
        }
        var disabled = 'disabled';
        if (this.context.user.username == Object.getOwnPropertyNames(this.props.roomObject.roomProps.ops)) {
            disabled = '';
        }
        return(
            <div className="chat-window">
                {messages.map(m => (
                    <div key={m.timestamp}>
                        {m.timestamp.substring(11, 19) + ': ' + m.nick + ' --> ' + m.message}
                    </div> ))}
                <div className="input-box">
                    <input 
                        type="text" 
                        value={this.state.msg}
                        className="input input-big"
                        onInput={(e) => this.setState({ msg: e.target.value })} />
                    <button type="button" className="btn pull-right" onClick={() => this.sendMessage()}>Send</button>
                </div>
                <div>
                    {

                    }
                    <input 
                        type="text"
                        onInput={ (e) => this.setState({userBan: e.target.value})} />
                    <button disabled={disabled} onClick = {() => this.banUser(this.state.userBan)}>Ban</button>

                    <input 
                        type="text"
                        onInput={ (e) => this.setState({userKick: e.target.value})} />
                    <button disabled={disabled} onClick = {() => this.kickUser(this.state.userKick)}>Kick</button>

                    <button onClick= {() => this.roomLeave()}>Leave</button>
                </div>
            </div>
        );
    };

};

ChatWindow.contextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
}

export default ChatWindow;