module.exports = {
    name: "Join Voice Channel",

    description: "Joins the voice channel.",

    category: ".Audio V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "voice_channel",
            "name": "Voice Channel",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The voice channel to join.",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [
        {
            "id": "deaf",
            "name": "Deaf Bot?",
            "description": "Description: Deaf Bot? (More Privacy)",
            "type": "CHECKBOX"
        },
        {
            "id": "mute",
            "name": "Mute Bot?",
            "description": "Description: Mute Bot? (More Privacy)",
            "type": "CHECKBOX"
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache) {
        const { joinVoiceChannel } = await this.require('@discordjs/voice');
        const channel = this.GetInputValue("voice_channel", cache);
        const deaf = this.GetOptionValue("deaf", cache) === "true";
        const mute = this.GetOptionValue("mute", cache) === "true";

        await joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: deaf,
            selfMute: mute
        });

        this.RunNextBlock("action", cache);
    }
}