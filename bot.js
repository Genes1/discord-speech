const path = require("path");
const Discord = require("discord.js");
const tokenFile = require(path.join(__dirname, "./config/token.json"));
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const spawn = require("child_process").spawn;

// import { Readable } from "stream";

// class Silence extends Readable {
//   _read() {
//     this.push(Buffer.from([0xf8, 0xff, 0xfe]));
//   }
// }
const client = new Discord.Client();

ffmpeg.setFfmpegPath(path.resolve(__dirname, "node_modules", ".bin", "ffmpeg"));
ffmpeg.setFfprobePath(
  path.resolve(__dirname, "node_modules", ".bin", "ffprobe")
);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content == ".kill") {
    client.destroy();
    return;
  }

  if (message.content === ".join") {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      message.reply(message.member);
      new Promise((res) =>
        connection
          .play(
            "https://github.com/Clemens-E/better-airhorn/raw/master/music/ding.wav"
          )
          .on("finish", res)
      );
      const receiver = await connection.receiver.createStream(message.member, {
        mode: "pcm",
      });
      //   const audio = connection.receiver.createStream(message.member, {
      //     mode: "opus",
      //     end: "manual",
      //   });
      //   audio
      //     .on("data", (chunk) => console.log("hello"))
      //     .on("close", () => console.log("close"))
      //     .on("error", (e) => console.log(e))
      //     .on("readable", () => {
      //       //   let data;
      //       //   while ((data = audio.read())) {
      //       //     console.log(data);
      //       //   }
      //     })
      //     .on("close", () => console.log("closed"));
      ////

      receiver.resume();
      console.log(receiver);
      console.log(receiver.isPaused());
      receiver.on("data", (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
      });

      receiver.on("end", () => {
        console.log("There will be no more data.");

        // console.log("fo2345ol");
        // exec("./run.bat", (err, stdout, stderr) => {
        //   if (err) {
        //     // node couldn't execute the command
        //     return;
        //   }
        //   console.log("fool");
        //   // the *entire* stdout and stderr (buffered)
        //   console.log(`stdout: ${stdout}`);
        //   console.log(`stderr: ${stderr}`);
        // });
        // console.log("fo22222ol");
        var cmd = "run.bat";
        var args = [];
        var proc = spawn(cmd, args);

        proc.stdout.on("data", function (data) {
          console.log(data);
        });

        proc.stderr.setEncoding("utf8");
        proc.stderr.on("data", function (data) {
          console.log(data);
        });

        proc.on("close", function () {
          console.log("finished");
        });
      });
      receiver.pipe(fs.createWriteStream("./user_audio.pcm"));

      //   setTimeout(function(){ alert("Hello"); }, 3000);

      //   try {
      //     const out = fs.createWriteStream("./audio.wav");
      //     ffmpeg(receiver)
      //       .inputFormat("s16le")
      //       .audioFrequency(16000)
      //       .audioChannels(2)
      //       .format("s16le")
      //       .on("error", console.error.bind(console))
      //       .pipe(out);
      //   } catch (error) {
      //     console.log(error);
      //   }
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }
});

// TODO make the bot listen to all users in the channel

client.on("error", console.error);

client.login(tokenFile.token);
