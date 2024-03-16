const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const {attchCookiesToResponse} = require('../utils')


const register = async (req,res) => {
    const{ name, email, password} = req.body
    //if(!name || !email || !password){
      //  throw new BadRequestError('Please provide name,email and password')
    //}
    
    const user = await User.create({...req.body})
    const tokenUser = {
        name: user.name,
        userId: user._id,
        email: user.email
    }
    attchCookiesToResponse({ res, user: tokenUser})

    res
       .status(StatusCodes.CREATED)
       .json({ user: { name: user.name} })
}
  
const login = async (req,res) => {
   const {email, password} = req.body
   if(!email || !password){
    throw new BadRequestError('Please provide email and password')
}
   const user = await User.findOne({email})
   
   if(!user){
    throw new UnauthenticatedError('Invalid Credentials')
   }
   const isPasswrodCorrect = await user.comparePassword(password)
   if(!isPasswrodCorrect){
    throw new UnauthenticatedError('Invalid Credentials')
   }  
   // compare password
   const token = user.createJWT();
   res.status(StatusCodes.OK).json({user:{name: user.name }, token})
}

module.exports = {
    login,
    register,
}
