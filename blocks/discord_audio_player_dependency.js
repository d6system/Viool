module.exports = {
    name: "Discord Audio Player [Dependency]",

    description: "Starts the Discord Audio Player dependency required for other blocks to work.",

    category: "Dependencies",

    inputs: [],

    options: [
        {
            "id": "devmode",
            "name": "Developer Mode",
            "description": "Description: If you are a developer and want to see more information in the console.",
            "type": "CHECKBOX"
        },
        {
            "id": "disableupdate",
            "name": "Disable Updates",
            "description": "Description: If you want to disable the automatic update.",
            "type": "CHECKBOX"
        },
        {
            "id": "forceupdate",
            "name": "Force Update",
            "description": "Description: If you want to force the automatic update.",
            "type": "CHECKBOX"
        }
    ],

    outputs: [],

    async init(DBB) {
        const {readFileSync} = await DBB.Core.require("fs");
        const values = JSON.parse(readFileSync(DBB.File.paths.workspaces)).map((item) => { return item.blocks.filter(x => x.name == 'discord_audio_player_dependency') }).filter(x => x[0]).map(x => x.map(x => x.options).flat()).flat()[0];

        const devmode = values ? values.devmode : undefined;
        const disableupdate = values ? values.disableupdate : undefined;
        const forceupdate = values ? values.forceupdate : undefined;
        if(!Boolean(disableupdate)) {
            if(Boolean(forceupdate)) {
                await startUpdate();
                DBB.Blocks.Data.setData("LastMusicBlocksUpdate", new Date(), "none")
            } else if (DBB.Blocks.Data.getData("LastMusicBlocksUpdate", "none")) {
                const date = new Date(DBB.Blocks.Data.getData("LastMusicBlocksUpdate", "none"));
                if ((new Date(date).setDate(date.getDate() + 1)) < new Date()) {
                    await startUpdate();
                    DBB.Blocks.Data.setData("LastMusicBlocksUpdate", new Date(), "none")
                }
            } else {
                await startUpdate();
                DBB.Blocks.Data.setData("LastMusicBlocksUpdate", new Date(), "none")
            }
        } else {
            DBB.Core.console("INFO", "Skipping Updates...")
        }

        async function startUpdate() {
            const file = require('../package.json')
            let restart = false

            DBB.Core.console("INFO", "Checking for Updates...")

            /* Package management */
            const dependency = ['fs', 'node-fetch', 'child_process']
            const install = ['discord.js', 'discord-player', '@discord-player/extractor', 'discord-player-youtubei', 'ffmpeg-static', 'mediaplex',  
                '@distube/ytdl-core'
            ]
            const remove = [
                '@discordjs/opus', 
                'ytdl-core',
                'youtube-ext',
                'play-dl'
            ]

            /* Check and install dependencies */
            for (var module of dependency) {
                if (!file.dependencies[module]) {
                    try {
                        if (module === 'node-fetch') module = 'node-fetch@2';
                        await DBB.Core.require(module, true, false, true)
                        await DBB.Core.console("SUCCESS", `Succesfully installed the module "${module}".`)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }

            /* Asign variables */
            const fs = require('fs')
            const fetch = require('node-fetch')
            const {execSync} = require('child_process')

            /* Check and install Packages */
            for (const module of install) {
                DBB.Core.console("INFO", `${module}...`)
                if (module.includes("@") && !module.startsWith("@")) {
                    const packagejson = fs.readFileSync("package.json")
                    if (JSON.parse(packagejson).dependencies[module.split("@")[0]].replace("^", "") != module.split("@")[1]) {
                        await DBB.Core.console("INFO", `The Module ${module} has an Update and will be Updated soon...`);
                        try {
                            await DBB.Core.require(`${module}`, true, false, true)
                            await DBB.Core.console("SUCCESS", `Succesfully installed the module "${module}".`)
                        } catch (err) {
                            await DBB.Core.console("WARN", `Not possible to install the module "${module}" Please try again later.`)
                        }
                    }
                } else {
                    const endpoint = `https://registry.npmjs.org/${module.replace("@latest", "")}/latest`;
                    const res = await fetch(endpoint);
                    const data = await res.json();
                    const packagejson = fs.readFileSync("package.json")

                    if (`^${data.version}` !== `${JSON.parse(packagejson).dependencies[module]}`) {
                        if (JSON.parse(packagejson).dependencies[module]) await DBB.Core.console("INFO", `The Module ${module} has an Update and will be Updated soon...`);
                        try {
                            await DBB.Core.require(`${module}@latest`, true, false, true)
                            await DBB.Core.console("SUCCESS", `Succesfully installed the module "${module}".`)
                        } catch (err) {
                            await DBB.Core.console("WARN", `Not possible to install the module "${module}" Please try again later.`)
                        }

                    }
                }
            }

            /* Remove old Packages */
            for (const module of remove) {
                const packagejson = fs.readFileSync("package.json");
                if (JSON.parse(packagejson).dependencies[module]) {
                    try {
                        const child = execSync(
                            `npm remove "${module}" --loglevel=error`
                        ).toString()
                        if (!child.includes('removed')) throw new Error();
                        await DBB.Core.console('LOG', 'The module "' + module + '" was removed successfully.')
                        restart = true
                    } catch (err) {
                        await DBB.Core.console("WARN", `Not possible to remove the module "${module}" Please try again later.`)
                    }
                }
            }

            /* Restart if packages were removed */
            if (restart) {
                await DBB.Core.console("INFO", "If this Error Pops Up then your bot will automatically restart! (Discord Audio Player Dependency Block)")
                await DBB.Core.restart()
            }

            DBB.Core.console("SUCCESS", "Update Complete!")
        }

        const fs = require("fs")
        /* discord-player setup */
        if (!DBB.Dependencies.DiscordPlayer) DBB.Dependencies.DiscordPlayer = {}

        try {
            require("discord-player")
        } catch(err) {
            if(err.code === "MODULE_NOT_FOUND") {
                const _module = err.message.split("'")[1];
                await DBB.Core.require(_module, true, false, true).catch((err) => {})
                DBB.Core.restart()
                return;
            }
        }

        const {Player} = await DBB.Core.require("discord-player");
        DBB.Dependencies.DiscordPlayer.module = await DBB.Core.require("discord-player")

        if (fs.existsSync(".env")) {
            const env = fs.readFileSync(".env");
            if (env.includes("DP_FORCE_YTDL_MOD=\"play-dl\"")) {
                fs.rmSync(".env");
            }
        }
        process.env.FFMPEG_PATH = require('ffmpeg-static');
        DBB.Dependencies.DiscordPlayer.player = new Player(DBB.DiscordJS.client, {
            ytdlOptions: {
                quality: "highestaudio",
                filter: "audioonly"
            },
            skipFFmpeg: false
        });
        if(Boolean(devmode)) DBB.Core.console("INFO", "Registering Extractors...")
        const { YoutubeiExtractor } = require("discord-player-youtubei")
        await DBB.Dependencies.DiscordPlayer.player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
        await DBB.Dependencies.DiscordPlayer.player.extractors.register(YoutubeiExtractor, {
            overrideBridgeMode : "yt"
        });
        if(Boolean(devmode)) DBB.Core.console("SUCCESS", "Registered Extractors Successfully!")
    },

    code() {
    }
}