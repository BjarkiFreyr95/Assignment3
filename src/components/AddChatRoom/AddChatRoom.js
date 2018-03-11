import React from 'react';
import { PropTypes } from 'prop-types';


class AddChatRoom extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            roomName: '', 
            updateList: props.updateList
        };
    }

    validateRoomName() {

        const {roomName} = this.state;
        if (roomName.length != 0) {
            
            const { socket } = this.context;
            const self = this;
            socket.emit('joinroom', {room: roomName}, function(successful, error) {
                if (!successful) {
                    alert('Failed to create room for reason: ' + {error});
                } else {
                    self.state.updateList();
                    console.log('room created');
                }
            });
        }
    }

    render () {
        console.log(this.props.chatRooms);
        return (
            <div>
                <input 
                    type="text" 
                    placeholder="Name of room" 
                    onInput={ (e) => this.setState({roomName: e.target.value})} required />
                <button onClick = {() => this.validateRoomName()}>Add Chatroom</button>

            </div>
        );
    }
};

AddChatRoom.contextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
}

export default AddChatRoom;

