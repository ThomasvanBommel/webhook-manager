import express from "express";

const app = express();
const secret = "12345abcde";

app.use(express.json());

app.all("*", (req, res) => {
    if(req.url === "/favicon.ico") return;

    console.log("----------------------")
    console.log("ID: ", req.ip);
    console.log("URL: ", req.url, req.params);

    try{
        const accept: Object = JSON.parse(req.headers.accept ?? "{}");
        const event = accept["x-github-event" as keyof Object] ?? "";

        console.log("EVENT: ", event);
        console.log("Headers: ", req.headers);
        console.log("Some JSON: ",  req.body);

        res.send("Thanks!");
    }catch{
        res.status(500).send("Error");
    }
});

app.listen(8080, () => 
    console.log("Listening @ http://192.168.1.181:8080")
);