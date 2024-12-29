const authAdmin = (req,res,next)=>{
    console.log('admin auth')
    const token="xyz"
    const authenticateToken = token==="xyz"
    if(authenticateToken){
        next()
    }else{
        res.status(401).send('auth failed')
    }

}

module.exports = {
    authAdmin
}