import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import './Chat.css';
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import {AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined} from "@material-ui/icons";
import {roomsCollection} from "./firebase";
import {useStateValue} from "./StateProvider";
import firebase from 'firebase';

function Chat() {

    const [{user}, dispatch] = useStateValue();
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState([]);

    const {roomId} = useParams();
    const [roomName, setRoomName] = useState("");

    useEffect(() => {
        if (roomId) {
            roomsCollection.doc(roomId).onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ));
            roomsCollection.doc(roomId)
                .collection("messages")
                .orderBy("timestamp","asc")
                .onSnapshot((snapshot) => (
                    setMessages(snapshot.docs.map((doc) => doc.data()))
                ))
        }
    }, [roomId, setMessages])

    const sendMessage = (e) => {
        e.preventDefault()
        console.log(`You typed >>>`, input);

        roomsCollection.doc(roomId)
            .collection('messages')
            .add({
                message: input,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setInput("")
    }

    useEffect(() => {
        setSeed(Math.floor(Math.random()*5000));
    },[])

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen {" "}
                        {new Date(messages[messages.length -1] ?.timestamp?.toDate()).toUTCString()}</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map(message => (
                    <p key={message.id} id={message.id} className={`chat__message ${message.name === user.displayName && "chat__receiver"}`}>
                    <span className="chat__name">
                        {message.name}
                    </span>
                        {message.message}
                        <span className="chat__timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}

            </div>
            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input value={input}
                           onChange={e => setInput(e.target.value)}
                               type="text" placeholder="Type a message.."/>
                    <button onClick={sendMessage}
                    type="submit">Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat;