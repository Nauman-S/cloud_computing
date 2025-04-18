import React from "react";
import {Box} from "@mui/material";
import UserInteraction from "./UserInteraction";
import Header from "./Header";

const Chat = () => {
    return (
    <Box sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}>

        <Box sx={{ width: "100%", maxWidth: "1200px", mt: 3 }}>

         <Header/>

        </Box>


        <Box sx={{ width: "100%", maxWidth: "1200px", mt: 3 }}>
        
            <UserInteraction/>

        </Box>
    </Box>
    );
  };
  
export default Chat;