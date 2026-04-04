import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { param, query,body,validationResult } from 'express-validator';
import session from 'express-session';
//cookie parser for legacy user
import cookieParser from 'cookie-parser';


import 'dotenv/config'


//import userschema
import Player from './schemas/playerSchema.mjs';

//pasword hashing functions
import {hashPassword,verifyPassword} from './utils/passwordScure.mjs';

//for anti spam and safty
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';



//middlewares import
import {validateInput,checkSession,validate} from './generalMiddleware/validation.mjs';
import{initTowerGameSetting,updateTowerGameSetting} from './settingSheetFunctions/towerGameSettingSheetFunc.mjs';
import {initBallGameSetting,updateBallGameSetting} from './settingSheetFunctions/ballGameSettingSheetFunc.mjs';
import {initPizzaGameSetting,updatePizzaGameSetting} from './settingSheetFunctions/pizzaGameSettingSheetFunc.mjs';


//import individual game routes
import towerGameRoute from './routes/towerGameRoute.mjs';
import ballGameRoute from './routes/ballGameRoute.mjs';
import pizzaGameRoute from './routes/pizzaGameRoute.mjs';



//oauth2.0 imports
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';






const app = express();
//for production
app.set('trust proxy', 1);
//production block end

app.use(helmet());

app.use(cookieParser());


app.use(express.json({ limit: '10kb' }));
app.use(cors({
    
    origin: process.env.REACT_URL,
    
    //very important to allow cookies from react front end
    credentials: true,               
    
    // Optional but recommended: define allowed methods
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    // 4. Ensure headers like Content-Type are allowed
    allowedHeaders: ['Content-Type', 'Authorization']


}));
app.use(session({
    
    secret:process.env.SESSION_SECRET,
    
    saveUninitialized:false,
    
    resave:false,
    
    //for production
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,

        ttl: 1 * 24 * 60 * 60,
    }),
    //production block end

    name: "session.safadapt",
    
    cookie:{
        //a new version of the cookie, safari compatable

        httpOnly:true,
        //for production, expired in a day
        maxAge:1000 * 60 * 60 * 24 * 1,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV === 'production' ? 'lax' : 'lax',


        //safari specific
        //partitioned: process.env.NODE_ENV === 'production', commentedout because it doesn't work

        //production block end

    }


}));


//moved order
try{
    await mongoose.connect(process.env.MONGODB_URL,{
        //for production
        maxPoolSize:20,
        serverSelectionTimeoutMS: 5000
        //production block end
    });
    console.log('connected');
}catch(error){
    console.log(error);
}


//init all the setting sheets when server start, if not exist create one with default value, 
// if exist just load it to the memory for later use, this is to make sure we only have one setting sheet for each game, 
// and we can easily update the setting sheet in the future without restarting the server, 
// just update the setting sheet in the database and call the update function to update the memory data,
//  this is to avoid the problem of having multiple setting sheets in the database and not knowing which one is the correct one to use

try{
    await initTowerGameSetting();
    await initBallGameSetting();
    await initPizzaGameSetting();
}catch(error){
    console.error("Error initializing game settings:", error);
    
}


//use router for each game, this is to make the code more organized and easier to maintain, 
// each game has its own route file, and all the routes related to that game are defined in that file, 
// and then we just need to use the router in the main file, this is to avoid having a very long main file with all the routes defined in it,
//  which can be hard to read and maintain
app.use("/api/towerGame", towerGameRoute);
app.use("/api/ballGame", ballGameRoute);
app.use("/api/pizzaGame", pizzaGameRoute);



//oauth app.use, will create custom session, do not app.use(passport.session()) 
// because we are not using the default session of passport, we are using our own session with express-session, 
// and we will store the playerName in our own session, and use that to check if the user is logged in or not, 
// so no need to use passport.session() which will create another session and cause confusion
app.use(passport.initialize());
//populate passport strategies
import './strategies/googleStrategies.mjs';










//rate limit:
const globalLimiter = rateLimit({
    windowMs:  60 * 1000,
    limit: 1000,
    message: { 
        
        message: "Too many requests from this IP. Please slow down! 🛑" 
    }
});
app.use('/api/', globalLimiter);



//singup/login limmiter
const singUpLoginLimiter = rateLimit({
    windowMs:5000,
    limit:5,
    message:{
        message:"wait a bit and try again"
    }
});






//periodic updates:
const updateSettingSheetLimiter = rateLimit({windowMs:30000,limit:1});
app.get('/api/updateSettingSheet',updateSettingSheetLimiter,async (req,res)=>{
    
    try{
        
        await updateTowerGameSetting();
        await updateBallGameSetting();
        await updatePizzaGameSetting();


         //edit here to add more games
        return res.sendStatus(201);

    }catch(error){
        return res.sendStatus(401);
    }    
});



const addSpeedCoinsLimiter = rateLimit({windowMs: 500, limit: 1 });
app.post('/api/addSpeedCoins',checkSession,addSpeedCoinsLimiter,
    body('addCoinAmount').exists().isInt({min:0,max:999999999}),
    validateInput,
    async (req,res)=>{
        try{
            const {addCoinAmount} = req.body;
            const thePlayer = await Player.findOne({playerName:req.session.playerName});
            if(!thePlayer){return res.status(404).json({message:'user no longer there'})}
            thePlayer.speedCoins+= addCoinAmount;
            await thePlayer.save();
            return res.sendStatus(200);

        }catch(error){
            if(error.name){
                if(error.name==='VersionError'){
                    return res.status(400).json({message:'server busy, request failed'});
                }
                return res.status(500).json({message:'unknown error'})

            }
            return res.status(500).json({message:'internet error'})
        }
    }
);














//oauth2.0 routes, for google login
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile'],session: false, ...(process.env.NODE_ENV === 'development' ? { prompt: 'consent select_account' } : {})   })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.REACT_URL}/login`,session: false }),
  async (req, res) => {
    //create the session
    try{
        await new Promise((resolve, reject) => {
                req.session.regenerate((err) => (err ? reject(err) : resolve()));
        });

        //repopulate session data
        req.session.playerName = req.user.playerName;
        req.session.displayedName = req.user.displayedName;

        await new Promise((resolve, reject) => {
                req.session.save((err) => (err ? reject(err) : resolve()));
        });

        res.redirect(`${process.env.REACT_URL}/main`);
    }catch(error){
        console.error('Error during Google OAuth callback:', error);
        res.redirect(`${process.env.REACT_URL}/login`);
    }
  });


























app.post(`/api/signUp`,singUpLoginLimiter,async (req,res)=>{
    
    try{
        //register new player
    const {newPlayerName,newPlayerPassword} = req.body;
    if(!newPlayerName || !newPlayerPassword){
        return res.status(400).json({message:'playerName and playerPassword required!'});
    }
    //check valid password
    const passwordLengthValid = newPlayerPassword.length >= 6 && newPlayerPassword.length <= 12;
    const hasLetter = /[a-zA-Z]/.test(newPlayerPassword);

    if (!passwordLengthValid || !hasLetter) {
        return res.status(400).json({ 
            message: 'Password must be 6-12 characters long and contain at least one letter!' 
        });
    }

    //check valid playerName
    const playerNameValid = /^[a-zA-Z0-9_]{3,30}$/.test(newPlayerName);
    if(!playerNameValid){
        return res.status(400).json({message:'playerName must be 3-30 characters long and can only contain letters, numbers, and underscores!'});
    }

    //now adding oauth2.0, need to make sure manual signed in user cannot use the google_ prefix in their name
    if(newPlayerName.startsWith('google_')){
        return res.status(400).json({message:'playerName cannot start with google_ !'});
    }
    //make sure to add more prefix filter when add oauth for other third party in the future




    //create new player
        const hashedPassword = await hashPassword(newPlayerPassword);


        const newPlayer = new Player({playerName:newPlayerName,playerPassword:hashedPassword,displayedName:newPlayerName});
        await newPlayer.save();
        return  res.status(201).json({message:'player created successfully!'});

    }catch(error){
        if(error.code===11000){
            return res.status(400).json({message:'playerName already exists!'});
        }else{
            return res.status(500).json({message:'unknown error'});
        }
    }
    

});
    
app.post(`/api/login`,singUpLoginLimiter,async (req,res)=>{
    const{existPlayerName,existPlayerPassword} = req.body;
    try{
        const loginPlayer = await Player.findOne({playerName:existPlayerName});
        if(!loginPlayer){
            return res.status(400).json({message:'invalid playerName!'});
        }
        const passwordIsCorrect = await verifyPassword(existPlayerPassword,loginPlayer.playerPassword);
        if(!passwordIsCorrect){
            return res.status(400).json({message:'invalid playerPassword'});
        }




        //regenrate and save are older callback based functions, 
        // wrap them in a Promise to use await
    
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => (err ? reject(err) : resolve()));
        });

        req.session.playerName = loginPlayer.playerName;
        req.session.displayedName = loginPlayer.displayedName;

        // Use a Promise to make save "awaitable"
        await new Promise((resolve, reject) => {
            req.session.save((err) => (err ? reject(err) : resolve()));
        });

       
        console.log('Session saved:', req.session);
        // This only runs after the session is 100% saved.
        return res.status(200).json({ message: 'login successful!' });
        
        
        
    }catch(error){
        return res.status(500).json({message:'unknown error'});
    }


});



//general endpoints



const currentPlayerLimiter = rateLimit({windowMs: 1000, limit: 20 });
app.get('/api/currentPlayer',currentPlayerLimiter,(req,res)=>{
    try{
        
        if(!req.session.playerName){
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
            return res.status(440).json({message:'not logged in'});
        }else{
            return res.status(200).json({message:`Welcome Back! ${req.session.displayedName || req.session.playerName}`});
        }
    }catch(error){
        console.log('Error in /api/currentPlayer:', error);
        return res.status(500).json({message:'unknown error'});
    }
});




const getUserCoinsLimiter = rateLimit({windowMs: 1000, limit: 10 });
app.get('/api/getUserCoins',getUserCoinsLimiter,checkSession,async (req,res)=>{
    try {
      

        const thePlayer = await Player.findOne({ playerName: req.session.playerName });

        if (!thePlayer) {
            return res.status(404).json({ message: "Player not found" });
        }

        
        return res.status(200).json({ userCoins: thePlayer.speedCoins });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'unkown error'});
    }
})














    

    
    









//finally the logout logic
app.post('/api/logout', checkSession,(req, res) => {
    // Check if user is logged in
    

    const playerName = req.session.playerName;

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        // Clear the session cookie
        res.clearCookie('session.safadapt', {
            //for production

            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ADD THIS
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax', // MATCH SESSION CONFIG

            
            //safari specific
            //partitioned: process.env.NODE_ENV === 'production'
            //end of production block
        
        });

        console.log(`${playerName} logged out successfully`);
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

//this should work




//for production comment out this
const PORT = process.env.PORT!==undefined ? process.env.PORT : 3000;
app.listen(PORT,()=>{
    console.log(`sever started on port ${PORT}`);
    
});



//for production
export default app;