import React from 'react';
import ChatRoomItem from '../ChatRoomItem/ChatRoomItem';
import { PropTypes } from 'prop-types';
import AddChatRoom from '../AddChatRoom/AddChatRoom';
import PrivateMessage from '../PrivateMessage/PrivateMessage';

class ListChatRooms extends React.Component {
    componentDidMount() {
        this.updateList();
    }

    constructor (props) {
        super(props);
        this.state = {
            chatRooms: []
        };
    }

    updateList() {
        const { socket } = this.context;
        var self = this;
        socket.emit('rooms');
        socket.on('roomlist', (list) => {
            var sumArr = [];
            var currPropName;
            var currProp;
            for(var item in list) {
                currPropName = item;
                if (currPropName.length != 0) {
                    if((!(Object.keys(list[item].ops).length === 0 && list[item].ops.constructor === Object) ||
                    !(Object.keys(list[item].users).length === 0 && list[item].users.constructor === Object)) || 
                    currPropName === 'lobby') {
                        currProp = {
                            id: currPropName,
                            roomProps: list[item]
                        };

                        sumArr.push(currProp);
                    }
                    
                }
            }
            self.setState({
                chatRooms: sumArr
            })
        });
    }

    joinRoom(roomobj) {
        const { socket } = this.context;
        var self = this;
        
        socket.emit('joinroom', {room: roomobj.id}, function(successful, error) {
            if (!successful) {
                alert('Failed to join room for reason: ' + {error});
            } else {
                self.props.getChatRoom.getChatRoom(roomobj);
            }
        });

        //console.log(roomName);
    }


    render() {

        console.log('in render');
        console.log(this.state.chatRooms);
        var chatRoomItems = this.state.chatRooms.map((chatRoomItem) => {
            return < ChatRoomItem joinRoomFunc = { this.joinRoom.bind(this) } key={chatRoomItem.id}  info={chatRoomItem} />;
        });
        
        return (
            <div>
                <AddChatRoom chatRooms={this.state.chatRooms} updateList = { this.updateList.bind(this) } />
                <ul className="list-view">
                    {chatRoomItems}
                </ul>
                <PrivateMessage />
            </div>
        );
    }
}
ListChatRooms.contextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
}
export default ListChatRooms;
