const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb+srv://longnv_green:longnv12@monstercoffee.etcjwnj.mongodb.net/coffee_api?retryWrites=true&w=majority")
    console.log('Connect successfully!!!');
  } catch (err) {
    console.log('Connect failure!!!');
    throw err;
  }
}

module.exports = { connect };
