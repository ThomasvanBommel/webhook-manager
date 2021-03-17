import express from "express";
import crypto from "crypto";
import http from "http";

const app = express();
const repoID = "333275051";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set headers using middleware
app.use((req, res, next) => {
    res.set("X-Powered-By", "Sagittarius A*");
    next();
});

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

app.all("*", (req, res) => {
    if(req.url === "/favicon.ico") return;

    console.log("----------------------")
    console.log("ID: ", req.ip);
    console.log("URL: ", req.url, req.params);

    if("x-github-event" in req.headers)
        console.log("EVENT: ", req.headers["x-github-event"]);

    console.log("Headers: ", req.headers);
    console.log("Verified: ", verifyRequest(req));

    res.send("Thanks!");
});

app.listen(8080, () => 
    console.log("Listening @ http://192.168.1.181:8080")
);