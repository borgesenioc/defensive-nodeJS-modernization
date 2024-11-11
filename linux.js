import fs from "fs";
// Import execFile
import { execFile } from "child_process";

export default function linux_callback(request, response) {
    const command = request.query?.commandChooser;
    let content = "";

    if (command) {
        content = fs.readFileSync("public/linux.html", "utf8");

        // Example command and args handling for execFile
        const args = []; // Define command arguments if any
        try {
            execFile(command, args, (error, stdout, stderr) => {
                if (error || stderr) {
                    content = content.replace("&gt;", "&gt; " + (error ? error + "<br/>" : "") + stderr);
                } else {
                    content = content.replace("&gt;", "&gt; " + stdout);
                }
                response.send(content);
            });
        } catch (err) {
            response.status(500).send("Command execution failed.");
        }
    } else {
        try {
            content = fs.readFileSync("public/linux.html", "utf8");
        } catch (e) {
            console.log("Error:", e.stack);
        }
        response.send(content);
    }
}
