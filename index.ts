import express from "express";

const app = express();

app.use(express.json());

app.all("*", (req, res) => {
    if(req.url === "/favicon.ico") return;
    
    console.log("----------------------")
    console.log("ID: ", req.ip, req.hostname);
    console.log("URL: ", req.url, req.params);
    console.log("Headers: ", req.headers);
    console.log("Some JSON: ",  req.body);

    res.send("Welcome!");
});

app.listen(8080, () => 
    console.log("Listening @ http://192.168.1.181:8080")
);