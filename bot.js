const path = require("path")
const Discord = require('discord.js');
const tokenFile = require(path.join(__dirname, "./config/token.json")); 
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');


const client = new Discord.Client();


ffmpeg.setFfmpegPath(path.resolve(__dirname, 'node_modules', '.bin', 'ffmpeg'));
ffmpeg.setFfprobePath(
  path.resolve(__dirname, 'node_modules', '.bin', 'ffprobe')
);


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;


  if (message.content == '.kill') {
  	client.destroy();
  	return;
  }


  if (message.content === '.join') {

    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
    	const connection = await message.member.voice.channel.join();
    	message.reply(message.member);
    	const receiver = await connection.receiver.createStream(message.member, { mode: 'opus' });
    	receiver.resume();
    	console.log(receiver);
    	console.log(receiver.isPaused());
    	receiver.on('data', (chunk) => {
    		console.log(`Received ${chunk.length} bytes of data.`);
    	});

    	receiver.on('end', () => {
    		console.log('There will be no more data.');
    	});

    	receiver.pipe(fs.createWriteStream('user_audio'));


/*    	try {
    		const out = fs.createWriteStream('./audio.wav');
    		ffmpeg(receiver)
    		.inputFormat('s32le')
    		.audioFrequency(16000)
    		.audioChannels(1)
    		.audioCodec('pcm_s16le')
    		.format('s16le')
    		.on('error', console.error.bind(console))
    		.pipe(out);
    	} catch (error) {
    		console.log(error);
    	}
*/

    } else {
    	message.reply('You need to join a voice channel first!');
    }


    



}


});





// TODO make the bot listen to all users in the channel


client.on("error", console.error);


client.login(tokenFile.token);
