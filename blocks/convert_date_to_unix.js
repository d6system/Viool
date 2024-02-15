module.exports = {
    name: "Convert Date Object To Unix Timestamp",

    description: "Converts date object to Unix timestamp.",

    category: "Date Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "date",
            "name": "Date",
            "description": "Acceptable Types: Date, Unspecified\n\nDescription: The date object to convert.",
            "types": ["date", "unspecified"],
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
        },
        {
            "id": "unix",
            "name": "Unix Timestamp",
            "description": "Type: Number\n\nDescription: The unix timestamp.",
            "types": ["number"]
        }
    ],

    code(cache) {
        const date = this.GetInputValue("date", cache);
        const unixTimestamp = Math.floor(date.getTime() / 1000);
        
        this.StoreOutputValue(unixTimestamp, "unix", cache);
        this.RunNextBlock("action", cache);
    }
}