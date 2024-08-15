module.exports = {
    name: "Create Button",
    description: "Create a button.",
    category: "Buttons",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "styles",
            name: "Style",
            description: "Type: Text\n\nDescription: The Style of the Button. [blurple], [grey], [green], [red], [url]",
            types: ["text", "unspecified"]
        },
        {
            id: "label",
            name: "Label",
            description: "Type: Text\n\nDescription: The Label of the Button.",
            types: ["text", "unspecified"]
        },
        {
            id: "emoji",
            name: "Emoji",
            description: "Type: Text\n\nDescription: The Emoji for the Button. (OPTIONAL)",
            types: ["text", "unspecified"]
        },
		{
            id: "id",
            name: "ID / URL",
            description: "Type: Text\n\nDescription: The ID or URL of the Button.",
            types: ["text", "unspecified"]
        },
        {
            id: "enable",
            name: "Disabled?",
            description: "Description: Whether this button is enabled or disabled",
            types: ["boolean", "unspecified"]
        }
    ],
    options: [
        {
            id: "styles",
            name: "Style",
            description: "Type: Text\n\nDescription: The Style of the Button. [blurple], [grey], [green], [red], [url]",
            type: "SELECT",
            options: {                
                "primary": "Blurple / Primary",
                "secondary": "Grey / Secondary",
                "success": "Green / Success",
                "danger": "Red / Danger",
                "link": "Link / Url"
            }
        },
        {
            id: "label",
            name: "Label",
            description: "Type: Text\n\nDescription: The Label of the Button.",
            type: "TEXT"
        },
        {
            id: "emoji",
            name: "Emoji",
            description: "Type: Text\n\nDescription: The Emoji for the Button. (OPTIONAL)",
            type: "TEXT"
        },
		{
            id: "id",
            name: "ID / URL",
            description: "Type: Text\n\nDescription: The ID or URL of the Button.",
            type: "TEXT",
            multiOption: true
        },
        {
            id: "enable",
            name: "Disabled?",
            description: "Description: Whether this button is enabled or disabled",
            type: "CHECKBOX",
            defaultValue: false
        }
    ],
    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            types: ["action"]
        },
        {
            id: "button",
            name: "Button",
            description: "Description: The Button output.",
            types: ["object"]
        },
    ],
    async code(cache) {

        const { ButtonBuilder, ButtonStyle } = require('discord.js');

        var style = this.GetInputValue("styles", cache) || this.GetOptionValue("styles", cache);
        const label = this.GetInputValue("label", cache) || this.GetOptionValue("label", cache) || undefined;      
        const emoji = this.GetInputValue("emoji", cache) || this.GetOptionValue("emoji", cache) || undefined;
        const id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache) || null;
        const disabled = this.GetInputValue("enable", cache) || this.GetOptionValue("enable", cache);      

        idURL = (style === "link")? "a URL" : "an ID"

        const fail = (message) => {
            this.console("WARN", message);
            this.RunNextBlock("action", cache)
        }        

        if (!label && !id) {
            fail(`The 'Create Button' block (#${cache.index + 1}) doesn't have a label or ${idURL}`);
            return
        }
        if (!label) {
            fail(`The 'Create Button' block (#${cache.index + 1}) doesn't have a label!`);
            return
        }
        if (!id) {
            fail(`The 'Create Button' block (#${cache.index + 1}) doesn't have ${idURL}`);
            return
        }

        if(style == "primary"){
            style = ButtonStyle.Primary
        } else if(style == "secondary") {
            style = ButtonStyle.Secondary
        } else if(style == "success") {
            style = ButtonStyle.Success
        } else if(style == "danger") {
            style = ButtonStyle.Danger
        } else if(style == "link") {
            style = ButtonStyle.Link
        }

        var button =
            new ButtonBuilder()
                .setStyle(style)
                .setDisabled(disabled)     
                       
            if (label) button.setLabel(label)
            if (emoji) button.setEmoji(emoji)
            style !== ButtonStyle.Link ? button.setCustomId(id) : button.setURL(id)

        this.StoreOutputValue([button], "button", cache)
        this.RunNextBlock("action", cache)
    }
}

