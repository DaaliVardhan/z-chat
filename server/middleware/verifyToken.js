const jwt = require('jsonwebtoken');

async function verifyToken(req,res,next){
    if(!req.cookies?.token) return res.status(401).json({status:false,message:"Unauthorized"});
    const token = req.cookies.token;
    const id = await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
    if(!id) return res.status(401).json({status:false,message:"Unauthorized"});
    req.user = id;
    next();
}

module.exports = verifyToken;