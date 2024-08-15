module.exports = {
    name: "Create Selection Menu",
    description: "Create a selection menu.",
    category: "Menu",
    inputs: [
        {
            id: "action",
            name: "Action",
            description: "Type: Action\n\nDescription: Executes this block.",
            types: ["action"]
        },
        {
            id: "options",
            name: "Option",
            description: "Type: List\n\nDescription: The Menu component to add (Maximum of 25).",
            types: ["object", "unspecified"],
            multiInput: true,
            required: true,
            maxInputs: 25
        },
        {
            id: "label",
            name: "Placeholder Label",
            description: "Description: The Label of the Menu that is seen before a selection occurs.",
            types: ["text", "unspecified"]
        },
		{
            id: "id",
            name: "ID of the Menu",
            description: "Description: The ID of the Menu.",
            types: ["text", "unspecified"]
        },
		{
            id: "maxvalues",
            name: "Max Possible Selects",
            description: "Description: The Amount of Selects possible. Default: 1",
            types: ["number", "unspecified"]
        },
		{
            id: "minvalues",
            name: "Min Required Selects",
            description: "Description: The Amount of Selects Needed. Default: 1",
            types: ["number", "unspecified"]
        }
    ],
    options: [
        {
            id: "label",
            name: "Placeholder Label",
            description: "Description: The Label of the Menu that is seen before a selection occurs.",
            type: "text"
        },
		{
            id: "id",
            name: "ID of the Menu",
            description: "Description: The ID of the Menu.",
            type: "text"
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
            id: "menu",
            name: "Menu",
            description: "Description: The Menu Object.",
            types: ["object", "unspecified"]
        }
    ],
    async code(cache, DBB) {

        const { StringSelectMenuBuilder } = require('discord.js');

        var id = this.GetInputValue("id", cache) || this.GetOptionValue("id", cache);
        var label = this.GetInputValue("label", cache) || this.GetOptionValue("label", cache);
        var options = this.GetInputValue("options", cache);
        const maxvalues = parseInt(this.GetInputValue("maxvalues", cache)) || 1;
        const minvalues = parseInt(this.GetInputValue("minvalues", cache)) || 1;

        options = options.filter((option, index) => {
            if (option && option.description == '') option.description = undefined;
            if (option && (option.label !== '' && option.value !== '')) {
                return true;
            } else if (option) {
                if (!option.label && !option.value) {
                    DBB.Core.console("WARN", `The menu option #${index + 1} was removed from the 'Create Selection Menu' block (#${cache.index + 1}) as it does not have a label or a value`);
                } else if (!option.label) {
                    DBB.Core.console("WARN", `The menu option #${index + 1} was removed from the 'Create Selection Menu' block (#${cache.index + 1}) as it does not have a label`);
                } else if (!option.value) {
                    DBB.Core.console("WARN", `The menu option #${index + 1} was removed from the 'Create Selection Menu' block (#${cache.index + 1}) as it does not have a value`);
                };
            };
        });

        if (options.length > 25) {
            options = options.slice(0, 25)
            DBB.Core.console("WARN", `The 'Create Selection Menu' block (#${cache.index + 1}) has more than 25 options! The maximum number of options per menu is 25, so only the first 25 will be used.`);
        };

        menu = new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder(label)
            .addOptions(options.flat())
            .setMaxValues(maxvalues)
            .setMinValues(minvalues)

        this.StoreOutputValue(menu, "menu", cache);
        this.RunNextBlock("action", cache);                
    }
}

