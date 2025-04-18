import React from "react";
import { Typography} from "@mui/material";
import { ResponsiveContainer } from "recharts";

const ChatHeader = () => {
    
    const title = "Chat";

    return (
    <ResponsiveContainer width="100%">
        <Typography
                variant="h3"
                sx={{
                textAlign: "center",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: "bold",
                mb: 2,
                }}
        >

            {title}

        </Typography>
    </ResponsiveContainer>
    );
};

export default ChatHeader;


