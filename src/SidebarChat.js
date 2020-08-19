import React, {useEffect, useState} from "react";
import './SidebarChat.css';
import Avatar from "@material-ui/core/Avatar";
import {roomsCollection} from "./firebase";
import {Link} from "react-router-dom";

function SidebarChat({addNewChat, id, name}) {
    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState('');

    useEffect(() => {
        if (id) {
            roomsCollection.doc(id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map((doc) => doc.data()))
                ))
        }
    }, [id])

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");
        if (roomName) {
            roomsCollection.add({
                name: roomName
            })
        }
    }

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, []);
    return !addNewChat ? (
        <Link to={`/room/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div className="sidebarChat" onClick={createChat}>
            <h2>Add New Chat</h2>
        </div>
    )
}

export default SidebarChat;