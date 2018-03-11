import React from 'react';
import ListChatRooms from '../ListChatRooms/ListChatRooms';

const Container = (chatRoomJoined) => {
    return (
        <ListChatRooms getChatRoom = {chatRoomJoined} />
    );
};

export default Container;