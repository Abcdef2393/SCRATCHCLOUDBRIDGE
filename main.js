import express from 'express';
const app = express();
const PORT = process.env.PORT || 10000;


app.get('/', (req, res) => {
  res.send('Server is up and running perfectly!');
});


import readline from 'readline';
import ScratchBridge from 'scratch3-bridge';
let msgrbridge = new ScratchBridge( process.env.SCRATCH_USER, process.env.SCRATCH_PASS, process.env.SCRATCH_PROJECT_ID);


msgrbridge.connect();
let sender;

msgrbridge.on('data', (msg,asender) =>{
    console.log(`>(${asender}): ${msg}`);
    sender = asender;
    msgrbridge.send( sender, `String reversed on the server: ${msg.toString().split('').reverse().join('')}`  );
});

msgrbridge.on('connect', () => {
    console.log( "Connected!! Sending your messages to Scratch:")
    
    const stdinput = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    stdinput.on('line', (msg) => {
        
        msgrbridge.send( sender, `Message written on the server: ${msg}` );
        if(msg === "quit"){
            stdinput.close();
        }
    })

})





app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
});

/*
the environment variables (ignore for now)
process.env.SCRATCH_USER,
  process.env.SCRATCH_PASS,
  process.env.SCRATCH_PROJECT_ID
*/
 
