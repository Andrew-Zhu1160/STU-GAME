import { validationResult } from "express-validator";

export function validateInput(req,res,next){
    const error = validationResult(req);
    console.log(error);
    if(!error.isEmpty()){
        return res.status(400).json({message:'invalid input'})
    }else{
        next();
    }

}

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {return res.status(400).json({ 
        message: errors.array()[0].msg });}
    next();
};

export function checkSession(req,res,next){
    if(!req.session.playerName){
        return res.status(400).json({message:'player not found'});
    }else{
        next();
    }
}

