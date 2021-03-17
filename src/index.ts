import { networkInterfaces } from "os";
import * as github from "./github";
import express from "express";

const app = express();

// Use request body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use GitHub header inspection middleware
app.use(github.headerInspection);

// Set headers using middleware
app.use((req, res, next) => {
    res.set("X-Powered-By", "Sagittarius A*");
    next();
});

// Response to all endpoints
app.all("*", (req, res) => {
    // Ignore favicon requests
    if(req.url === "/favicon.ico") return;

    // Log request data
    console.log("----------------------")
    console.log("ID: ", req.ip);
    console.log("URL: ", req.url);

    if(req.github && req.github.isVerified){
        console.log("Verified: ", req.github.isVerified);
        console.log("Event: ", req.github.event);
        console.log("Target Type: ", req.github.targetType);
        console.log("Target ID: ", req.github.targetID);
        // console.log("Headers: ", req.headers);

        return res.send("👍 Thanks!");
    }

    res.send("⛔ No thanks!");
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