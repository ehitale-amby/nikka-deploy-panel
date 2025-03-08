const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const repoURL = "https://github.com/haki-xerr/nikka-md.git"; // Change this to your repo
const botDir = "nikka-md"; // Change this to your bot's folder name

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to install dependencies and update config
function setupBot(sessionID, sudo, prefix) {
    try {
        console.log("Changing directory...");
        process.chdir(botDir);

        console.log("Installing dependencies...");
        execSync("pm2 start . --attach --name nikka", { stdio: "inherit" });

        // Update config.js with new SESSION_ID, SUDO, and PREFIX
        const newConfig = `const { Sequelize } = require("sequelize");
const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

const toBool = (x) => x == "true";

DATABASE_URL = process.env.DATABASE_URL || "./lib/database.db";
let HANDLER = "false";

module.exports = {
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  LOGS: toBool(process.env.LOGS) || false,
  ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
  SESSION_ID: "NIKKA-XmFUw2biB#h5L7RENGfVQlubs_RiB9T-jt5pFhZp8ZfPfuu_1rrvA}",
  LANG: process.env.LANG || "EN",
  HANDLERS: "${prefix}", 
  PRESCENCE: process.env.PRESCENCE || "typing",
  GREETINGS: process.env.GREETINGS || false,
  BRANCH: "main",
  WARN_COUNT: 3,
  STICKER_DATA: process.env.STICKER_DATA || "king;haki",
  BOT_INFO: process.env.BOT_INFO || "ɴɪᴋᴋᴀ ᴍᴅ;ʜᴀᴋɪ;https://files.catbox.moe/mnp025.jpg",
  AUDIO_DATA: process.env.AUDIO_DATA || "ʜᴀᴋɪ;shaka;https://files.catbox.moe/mnp025.jpg",
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
  PORT: process.env.PORT || 3000,
  CAPTION: process.env.CAPTION || "shaka",
  WORK_TYPE: process.env.WORK_TYPE || "private",
  DATABASE_URL: DATABASE_URL,
  DATABASE:
    DATABASE_URL === "./lib/database.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: false,
        })
      : new Sequelize(DATABASE_URL, {
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
          logging: false,
        }),
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || " ",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || " ",
  SUDO: "2347045787823",
  IMGBB_KEY: ["76a050f031972d9f27e329d767dd988f", "deb80cd12ababea1c9b9a8ad6ce3fab2", "78c84c62b32a88e86daf87dd509a657a"],
};`;

        fs.writeFileSync("config.js", newConfig, "utf8");
        console.log("config.js updated successfully.");

        console.log("Starting the bot...");
        execSync("npm start", { stdio: "inherit" });

    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Prompt user for SESSION_ID, SUDO, and PREFIX
rl.question("Enter your SESSION_ID: ", (sessionID) => {
    rl.question("Enter your SUDO (comma-separated numbers): ", (sudo) => {
        rl.question("Enter your PREFIX (default is '.'): ", (prefix) => {
            if (!prefix) prefix = "."; // Set default prefix if empty

            if (!fs.existsSync(botDir)) {
                console.log("Bot directory not found. Cloning the bot repository...");
                try {
                    execSync(`git clone ${repoURL} ${botDir}`, { stdio: "inherit" });
                } catch (error) {
                    console.error("Failed to clone repository:", error.message);
                    rl.close();
                    return;
                }
            } else {
                console.log("Bot directory already exists. Skipping git clone...");
            }

            // Proceed with setup
            setupBot(sessionID, sudo, prefix);

            rl.close();
        });
    });
});
