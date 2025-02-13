const { exec } = require("child_process");

console.log("please wait..");
exec("node bot.js", { stdio: "inherit" });
