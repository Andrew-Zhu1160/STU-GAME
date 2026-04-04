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
        //send out a unique status code for losing session (use 440), frontend use it to redirect to login page
        //check the cookie of the user
        //if it is a legacy sameSite:none version, clear that cookie
        if (req.cookies && req.cookies['connect.sid']) {
            console.log("Clearing legacy SameSite=None cookie");
            res.clearCookie('connect.sid', {
                path: '/', 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });
        }

        return res.status(440).json({message:'player not found'});
    }else{
        next();
    }
}

