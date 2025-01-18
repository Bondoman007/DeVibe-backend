const validateEditDataByuser = async function(req){
    const NotAllowedEditFeilds = ["emailId","password","_id"]
    const validate = Object.keys(req.body).every((feild)=>{
        return !NotAllowedEditFeilds.includes(feild)
    })
    if(!validate){
        throw new Error("Invalid data to edit")
    }
}

module.exports = validateEditDataByuser