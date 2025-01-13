const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 4
    },
    lastName: {
        type: String,
        maxLength: 50,
        minLength: 4
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value){
           if(!["male","female","others"].includes(value)){
            throw new Error("Gender data is not valid")
           }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fblank-profile-picture&psig=AOvVaw3SpBx7uM8Hv3xLb9D-HFza&ust=1736893891244000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCdlpLg84oDFQAAAAAdAAAAABAE"
    },
    about: {  
        type: String,
        default: "this is my description"
    },
    skills: {
        type: [String]
    }
},{
    timestamps:true,
})

const User = mongoose.model("User",userSchema)
module.exports = User
