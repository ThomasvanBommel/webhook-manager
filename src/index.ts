import { networkInterfaces } from "os";
import * as github from "./github";
import express, { Request } from "express";

const app = express();

type RepoObject = { [key: number]: { name: string, branch: string[] } };
const acceptedRepositories: RepoObject = {
    333275051: { name: "PortfolioTS", branch: [ "master" ] }
};

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

    // Check if request should start a new repository clone
    const url = getVerifiedURL(req);

    if(url){
        // Clone repository
        github.cloneRepository(url);

        // Thank github for such a great job!
        return res.send("👍 Thanks!");
    }

    // Request is not what we're looking for
    res.send("⛔ No thanks!");
});

/** Check for all prerequisits before returning the repositories clone url (ssh_url) */
function getVerifiedURL(req: Request){
    try{
        const { ssh_url, id } = req.body.repository;
        const { head_branch } = req.body.check_suite;

        if( req.github?.isVerified &&
            req.github?.event === "check_suite" &&
            req.github?.targetType === "repository" &&
            (req.github?.targetID ?? 0) in acceptedRepositories &&
            id && head_branch &&
            acceptedRepositories[id].branch.includes(head_branch))
            return String(ssh_url);

    }catch(error){ }

    return "";
}

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