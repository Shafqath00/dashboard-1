import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { error } from "console";
import { name } from "ejs";
import { text } from "stream/consumers";
import { ifError } from "assert";

const app = express();
const port = 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
    connectionString: process.env.db,
    ssl: {
        rejectUnauthorized: false
    },
});

db.connect((err) => {
    if (err) {
        console.error("Connection is failed !!!", err.stack);
    } else {
        console.log("db is connected successfully...");
    }
})


app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.post("/data", async (req, res) => {
    const date =await req.body.date;
    let qu;
    console.log(date);
    if (date) {
        console.log("date is valid");
        qu = await db.query("SELECT name,email,city,text,number FROM infos WHERE dates = $1", [date]);
        if(qu.rows.length !== 0) {

            res.render("index.ejs",{ db:qu.rows});
            
            console.log(qu.rows);
           
        } else {
            console.log("work ok");
            res.redirect("/");
        };
    } else {
        console.log("date is not valid");
        res.redirect("/")
    }
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})