import { Request, Response, NextFunction } from "express";
import { exec } from "child_process";
import crypto from "crypto";
import http from "http";

type GitHub = {
    isVerified?: boolean,
    event?: string | string[],
    targetType?: string | string[],
    targetID?: number
};

// Add properties to express objects
declare global {
    namespace Express {
        export interface Request {
            github?: GitHub
        }
    }
}

/** Parse request header and add GitHub object to request object */
export function headerInspection(req: Request, res: Response, next: NextFunction) {
    const github: GitHub = {
        isVerified: false,
        event: undefined,
        targetType: undefined,
        targetID: undefined
    };

    github.isVerified = verifyRequest(req);

    if("x-github-event" in req.headers)
        github.event = req.headers["x-github-event"];

    if("x-github-hook-installation-target-type" in req.headers)
        github.targetType = req.headers["x-github-hook-installation-target-type"];

    if("x-github-hook-installation-target-id" in req.headers)
        github.targetID = Number(req.headers["x-github-hook-installation-target-id"]);

    req.github = github;

    next();
}

/** Verify request signatures using environment variable WEBHOOK_SECRET */
function verifyRequest({ headers, body }: { headers: http.IncomingHttpHeaders, body: unknown }) {
    try{
        // Create sha256 HMAC using our 'key', stored in WEBHOOK_SECRET environment variable
        const hmac = crypto.createHmac("sha256", process.env["WEBHOOK_SECRET"] as string);

        // Add payload (requet body) to HMAC
        hmac.update(JSON.stringify(body), "utf-8");

        // Compare result with headers signature
        return "sha256=" + hmac.digest("hex") === headers["x-hub-signature-256"];

    // Log any errors
    }catch(error){
        console.error("Verification failure: " + error);
    }

    return false;
}

/** 
 * Clone a repository into the 'repositories' folder
 */
export function cloneRepository(sshURL: string){

    // Get username + project name from 'ssh_url'
    const temp = sshURL.replace("git@github.com:", "");

    // Make relative and absolute paths
    const relative = `../repositories/${temp.substr(0, temp.length - 4)}/${Date.now()}`;
    const absolute = `${__dirname}/${relative}`;

    // Create folder structure + clone repository
    exec(`mkdir -p ${absolute} && cd ${absolute} && git clone ${sshURL}`, () => {
        console.log("----------------------");
        console.log("Cloned new repository:", relative);
    });
}