import React, { useState, useEffect, useRef } from "react";
import {
  Page,
  Container,
  TextArea,
  Button,
  Form,
  MyRow,
  MyMessage,
  PartnerRow,
  PartnerMessage,
} from "./AppStyle";
import io from "socket.io-client";
import Image from './Image';

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("/");

    socketRef.current.on("your id", (id) => {
      setYourID(id);
      console.log(id);
    });

    socketRef.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    });
  }, []);

  function receivedMessage(message) {
    setMessages((oldMsgs) => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (file) {
      const messageObject = {
        id: yourID,
        type: "file",
        body: file,
        mimeType: file.type,
        fileName: file.name,
      };
      setMessage("");
      setFile("");
      socketRef.current.emit("send message", messageObject);
    } else {
      const messageObject = {
        body: message,
        type: "text",
        id: yourID,
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function selectFile(e) {
    setMessage(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  function renderMessage(message, index) {
    if(message.type === "file"){
      const blob = new Blob([message.body], {type:message.type});
      if(message.id === yourID){
        return(
        <MyRow key={index}>
          <Image fileName={message.fileName} blob={blob} />
        </MyRow>
        )
      }
      return(
        <PartnerRow key={index}>
          <Image fileName={message.fileName} blob={blob} />
        </PartnerRow>
      )
    }
    if (message.id === yourID) {
      return (
        <MyRow key={index}>
          <MyMessage>{message.body}</MyMessage>
        </MyRow>
      );
    }
    return (
      <PartnerRow key={index}>
        <PartnerMessage>{message.body}</PartnerMessage>
      </PartnerRow>
    );
  }

  return (
    <Page>
      <Container>{messages.map(renderMessage)}</Container>
      <Form onSubmit={sendMessage}>
        <TextArea
          value={message}
          onChange={handleChange}
          placeholder="Say something..."
        />
        <input onChange={selectFile} type="file" />
        <Button>Send</Button>
      </Form>
    </Page>
  );
};

export default App;
