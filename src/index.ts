import { signatureVerification } from "./github";
import { networkInterfaces } from "os";
import express from "express";

const app = express();

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set headers using middleware
app.use((req, res, next) => {
    res.set("X-Powered-By", "Sagittarius A*");
    next();
});

// Add GitHub signature verification middleware
app.use(signatureVerification);

// Response to all endpoints
app.all("*", (req, res) => {
    // Ignore favicon requests
    if(req.url === "/favicon.ico") return;

    // Log request data
    console.log("----------------------")
    console.log("ID: ", req.ip);
    console.log("URL: ", req.url, req.params);

    if("x-github-event" in req.headers)
        console.log("EVENT: ", req.headers["x-github-event"]);

    console.log("Headers: ", req.headers);
    console.log("Verified: ", req.isVerified ?? false);

    res.send("Thanks!");
});

// Start listening on all interfaces
app.listen(8080, () => {
    let interfaces: string[] = [];

    // Get all IPv4 interface addresses
    for(const [key, value] of Object.entries(networkInterfaces()))
        if(value)
            for(const { address, family } of value)
                if(family === "IPv4")
                    interfaces.push(`  http://${address}:8080 (${key})`);

    // Print all listening addresses
    console.log(`Listening interfaces: [ \n${ interfaces.join("\n") } \n]`);
});