const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
{
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        },
    },
},{
    timestamps: true,
})
 
const connectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)
module.exports = connectionRequest
