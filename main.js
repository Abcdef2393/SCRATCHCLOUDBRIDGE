import Scratch from 'scratch-api';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000;

// Setup a baseline route so Render knows the service is responsive
app.get('/', (req, res) => {
  res.send('Server is up and running perfectly!');
});

// Start the live connection loop using the scratch-api callback structure
Scratch.UserSession.create(
  process.env.SCRATCH_USER,
  process.env.SCRATCH_PASS,
  (err, session) => {
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

      // Listen for when variables change live on the Scratch servers
      cloud.on('set', (name, value) => {
        // Scratch cloud names usually come through with a special symbol: ☁ name
        if (name.includes("☁ Request")) {
          let receivedData = Number(value);
          console.log("Received:", receivedData);
          
          let responseData = receivedData * 2;
          
          // Set the response variable live on the servers
          cloud.set("☁ Response", responseData);
          console.log("Sent:", responseData);
        }
      });
    });
  }
);

// Start Express listening on the proper Render host configuration
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});
