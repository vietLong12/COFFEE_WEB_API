
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Contact = new Schema(
    {
        username: { type: Schema.Types.String, required: true },
        phone: { type: Schema.Types.String, required: true },
        email: { type: Schema.Types.String, required: true },
        content: { type: Schema.Types.String, required: true },
        createdAt: { type: Schema.Types.Date, required: true, default: new Date() },
    },
);

module.exports = mongoose.model("Contact", Contact, "coffee_contact");

