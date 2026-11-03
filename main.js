import { ScratchSession } from "s-api4js";

const session = await ScratchSession.login(
    process.env.SCRATCH_USER,
    process.env.SCRATCH_PASS
);

const cloud = session.cloud(Number(process.env.SCRATCH_PROJECT_ID));

await cloud.connect();

cloud.on("set", async ({ name, value }) => {

    if (name === "Request") {
        let receivedData = Number(value);
        console.log("Received:", receivedData);
        let responseData = receivedData * 2;
        await cloud.setVar("Response", responseData);
        console.log("Sent:", responseData);
    }
});