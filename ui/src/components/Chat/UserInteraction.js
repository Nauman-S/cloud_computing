import React from 'react';
import {Box, Container, Card} from "@mui/material";
import TextAndSubmission from "./TextAndSubmission";

const UserInteraction = () => {
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card elevation={3}>
            <main className="flex-1 flex flex-col justify-end p-4">
                <div className="max-w-4xl w-full mx-auto">
                <Box sx={{ width: "100%", maxWidth: "1200px", mt: 3 }}>
                    <TextAndSubmission />
                </Box>
                </div>
            </main>
        </Card>
    </Container>
  );
};

export default UserInteraction;