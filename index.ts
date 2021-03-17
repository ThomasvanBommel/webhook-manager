import express from "express";

const app = express();
const secret = "12345abcde";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res) => {
    // res.set("Content-Type", "application/json");
    res.set("X-Powered-By", "Sagittarius A*");

    if(req.url === "/favicon.ico") return;

    console.log("----------------------")
    console.log("ID: ", req.ip);
    console.log("URL: ", req.url, req.params);

    if("x-github-event" in req.headers)
        console.log("EVENT: ", req.headers["x-github-event"]);

    console.log("Headers: ", req.headers);

    if(req.body.payload){
        console.log("Payload: ", JSON.parse(req.body.payload));
    }else{
        console.log("Some JSON: ", req.body);
    }

    res.send("Thanks!");
});

app.listen(8080, () => 
    console.log("Listening @ http://192.168.1.181:8080")
);