module.exports = {
    name: "Leave Voice Channel",

    description: "Leaves the voice channel.",

    category: ".Audio V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "guild",
            "name": "Server",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The Guild to get the Voice Connection from!",
            "types": ["object", "unspecified"],
            "required": true
        }
    ],

    options: [],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        }
    ],

    async code(cache) {
        const { getVoiceConnection } = await this.require('@discordjs/voice');
        const guild = this.GetInputValue("guild", cache);

        const connection = await getVoiceConnection(guild.id);

        await connection.destroy();

        this.RunNextBlock("action", cache);
    }
}