import React from 'react';
import { PropTypes } from 'prop-types';



class ChatRoomItem extends React.Component {
    constructor(props) {
        super(props);
    }
    
    callJoinRoom() {
        this.props.joinRoomFunc(this.props.info);
    }
    render() {

        return(
            <li className="list-view-item">
                <p>id: {this.props.info.id}</p>
                <p>users: { Object.getOwnPropertyNames(this.props.info.roomProps.users) } </p>
                <button onClick = {() => this.callJoinRoom()} >Join</button>
            </li>
        );
    }
};

ChatRoomItem.contextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
}

export default ChatRoomItem;