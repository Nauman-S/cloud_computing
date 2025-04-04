import React from "react";
import { Box, Paper, Typography, CircularProgress, Fade } from "@mui/material";

const MessageVisualizer = ({content, isFromAgent, isEndOfStream}) => {
    return(
        <Fade in={true}>
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: isFromAgent ? "flex-start" : "flex-end",
              mb: 2 
            }}
          >
            <Paper 
              elevation={1} 
              sx={{
                maxWidth: "75%",
                p: 2,
                bgcolor: isFromAgent ? "grey.100" : "primary.main",
                color: isFromAgent ? "text.primary" : "common.white",
                borderTopLeftRadius: isFromAgent ? 0 : 16,
                borderTopRightRadius: isFromAgent ? 16 : 0,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                opacity: isEndOfStream ? 1 : 0.9
              }}
            >
              <Typography variant="body1">
                {content}
                {!isEndOfStream && isFromAgent && (
                  <Box component="span" sx={{ ml: 1, display: "inline-block" }}>
                    <CircularProgress size={12} thickness={6} color="inherit" />
                  </Box>
                )}
              </Typography>
            </Paper>
          </Box>
        </Fade>
      );
}

export default MessageVisualizer;