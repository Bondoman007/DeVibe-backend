const mongoose = require("mongoose")

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://kanishkDev:rpafAzM60tQOJT94@kanishkdev.aworo.mongodb.net/devTinder"
    )
}

module.exports = {connectDB}

