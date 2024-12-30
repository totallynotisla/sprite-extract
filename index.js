const fs = require("node:fs");
const ev = require("events");
const exec = require("child_process").exec;
const event = new ev.EventEmitter();

//clean the chara folder
fs.readdirSync("bin/chara").forEach((file) => fs.unlinkSync(`bin/chara/${file}`));

//Convert mvl to bin/chara
fs.readdirSync("input").forEach((file) => {
    if (!file.endsWith(".mvl")) return;

    let proc = exec(`cd bin && mvlView.exe ../input/${file}`);
    proc.once("error", console.log);
    proc.once("exit", () => {
        event.emit("done", file.toUpperCase().replace(/\s*_\.mvl$/gi, ""));
        console.log(`${file} is converted`);
    });
});

event.on("done", (file) => {
    fs.mkdirSync(`output/${file}`);
    fs.readdirSync(`bin/chara`).forEach((e) => {
        if (!e.includes(file)) return;
        let buffer = fs.readFileSync(`bin/chara/${e}`);
        fs.writeFileSync(`output/${file}/${e}`, buffer);
        fs.unlinkSync(`bin/chara/${e}`);
    });
});
