import calculator_callback from "./src/calculator.js";
import linux_callback from "./src/linux.js";
import regex_callback from "./src/regex.js";
import express from "express";
import fs from "fs";
import path from "path";

const hostname = "localhost";
const port = process.env.PORT || 4001;
const app = express();
app.use(express.static(path.resolve() + "/public"));

app.get("/", (request, response) => {
    const name = request.query?.fileSelector;
    let content = "";

    if (name) {
        if (name === "public/calculator.html") {
            response.redirect("/calculator");
        } else if (name === "public/linux.html") {
            response.redirect("/linux");
        } else if (name === "public/regex.html") {
            response.redirect("/regex");
        } else {
            try {
                // Secure file path handling
                const safeBasePath = path.resolve('public'); // Base directory for safety
                const resolvedPath = path.resolve(safeBasePath, name);
                if (!resolvedPath.startsWith(safeBasePath)) {
                    response.status(403).send("Access Denied");
                } else {
                    content = fs.readFileSync(resolvedPath, "utf8");
                    response.send(content);
                }
            } catch (err) {
                response.status(404).send("File not found");
            }
        }
    } else {
        try {
            content = fs.readFileSync("public/menu.html", "utf8");
        } catch (e) {
            console.log("Error:", e.stack);
        }
        response.send(content);
    }
});

app.get('/calculator', calculator_callback);
app.get('/linux', linux_callback);
app.get('/regex', regex_callback);

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
