import scratch from 'scratch-api';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Server is up and running perfectly!');
});

// Start the live connection loop
scratch.UserSession.create(
  process.env.SCRATCH_USER,
  process.env.SCRATCH_PASS,
  async (err, session) => {
    if (err) {
      return console.error("Login failed:", err);
    }
    
    console.log("Logged in successfully to Scratch!");

    // Connect directly to your live project
    session.cloudSession(Number(process.env.SCRATCH_PROJECT_ID), (err, cloud) => {
      if (err) {
        return console.error("Cloud connection failed:", err);
      }
      
      console.log("Connected to Scratch Cloud Variables!");

      // Listen for when variables change
      cloud.on('set', async (name, value) => {
        // Scratch cloud names usually come through with a special symbol: ☁ name
        if (name.includes("Request")) {
          let receivedData = Number(value);
          console.log("Received:", receivedData);
          
          let responseData = receivedData * 2;
          
          // Set the variable live on the servers
          cloud.set("Response", responseData);
          console.log("Sent:", responseData);
        }
      });
    });
  }
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});
