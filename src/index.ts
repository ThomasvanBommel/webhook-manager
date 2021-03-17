import { networkInterfaces } from "os";
import * as github from "./github";
import express from "express";

const app = express();
const acceptedRepositories = [ 
    /* PortfolioTS */ 333275051
];

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
    console.log("----------------------");
    console.log(new Date().toISOString());
    console.log("ID: ", req.ip);
    console.log("URL: ", req.url);

    // Check that the request came from github
    if(req.github && req.github.isVerified){

        // Log github header properties
        console.log(req.github);

        // Clone repository if check_suite event is successful
        if(req.github.event === "check_suite" && req.github.targetType === "repository"){

            // Ensure the target repository is one of the accepted ids
            if(req.github.targetID ?? 0 in acceptedRepositories){
                github.cloneRepository(req);
            }
        }

        // Thank github for doing a good job!
        return res.send("👍 Thanks!");
    }

    // Request is not what we're looking for
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