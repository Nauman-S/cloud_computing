import React, {useState} from "react";
import { ResponsiveContainer } from "recharts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Paper, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import MessageVisualizer from "./MessageVisualizer";
import URLs from "../../constants/urls";


const TextAndSubmission = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = () => {
      if (inputValue.trim()) {
        const userMessage = {
          id: `user-${Date.now()}`,
          content: inputValue,
          isFromAgent: false,
          isEndOfStream: true
        };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);

        const agentMessageId = `agent-${Date.now()}`;
        let agentResponse = "";
        setMessages(prevMessages => [
          ...prevMessages, 
          {
            id: agentMessageId,
            content: "",
            isFromAgent: true,
            isEndOfStream: false
          }
        ]);

        

          fetchEventSource(`${URLs.CHAT_MOCK_STREAM}?query=${encodeURIComponent(inputValue)}`, {
            method: "GET",
            headers: {
              "X-TESTER-REQUEST": "tester_secret_api_key",
            },
            onmessage: (event) => {
              console.log("Received event:", event.data);
              // setMessages((prevMessages) => [...prevMessages, event.data]); // Append new messages
              agentResponse += event.data;
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === agentMessageId 
                    ? { ...msg, content: agentResponse }
                    : msg
                )
              );
              
            },
            onclose: () => {
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === agentMessageId 
                    ? { ...msg, isEndOfStream: true }
                    : msg
                )
              );
              console.log("Connection closed");
            },
            onerror: (error) => {
              console.error("SSE connection error:", error);
            },
          });
    
          setInputValue("");
        }
      };
return (
    <ResponsiveContainer style={{ width: "100%", overflowX: "auto" }}>

      {messages.length > 0 && (
          <Paper 
            elevation={0}
            sx={{ 
              flex: 1, 
              overflow: "auto", 
              p: 2, 
              mb: 2,
              maxHeight: "500px",
              bgcolor: "background.default"
            }}
          >
            <Stack spacing={1}>
            {messages.map((message) => (
                <MessageVisualizer
                  key={message.id}
                  content={message.content}
                  isFromAgent={message.isFromAgent}
                  isEndOfStream={message.isEndOfStream}
                />
              ))}
              {/* <div ref={messagesEndRef} /> */}
            </Stack>


          </Paper>
      )}



      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        style={{
          width: "100%",
          whiteSpace: "nowrap",
          border: "none",
          outline: "none",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </ResponsiveContainer>
  );
};

export default TextAndSubmission;