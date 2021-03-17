import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import http from "http";

const repoID = "333275051";

// Add properties to express objects
declare global {
    namespace Express {
        export interface Request {
            isVerified?: boolean
        }
    }
}

/** Signature verification middleware (sets req.isVerified) */
export function signatureVerification(req: Request, res: Response, next: NextFunction) {
    req.isVerified = verifyRequest(req);
    next();
};

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