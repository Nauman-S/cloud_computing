import React, {useState} from "react";
import { ResponsiveContainer } from "recharts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import URLs from "../../constants/urls";


const TextAndSubmission = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = () => {
        if (inputValue.trim()) {
          console.log("Submitted message:", inputValue);
          fetchEventSource(`${URLs.CHAT_MOCK_STREAM}?query=${encodeURIComponent(inputValue)}`, {
            method: "GET",
            headers: {
              "X-TESTER-REQUEST": "tester_secret_api_key",
            },
            onmessage: (event) => {
              console.log("Received event:", event.data);
              setMessages((prevMessages) => [...prevMessages, event.data]); // Append new messages
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
      <input
        type="text"
        placeholder="placeholder"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
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