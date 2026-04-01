import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Player from "../schemas/playerSchema.mjs";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{

        const nickName = profile.displayName || `GoogleUser${profile.id}`;


        const googlePlayerName = `google_${profile.id}`;
        let googlePlayer = await Player.findOne({playerName: googlePlayerName});
        if(!googlePlayer){
            //for testing purpose, log the google player name that is being created
            console.log(`Creating new player for Google user: ${googlePlayerName}`);
            googlePlayer = new Player({playerName: googlePlayerName, displayedName: nickName});
            await googlePlayer.save();
        }

        //for testing purpose, log the google player name
        console.log(`Google user ${googlePlayerName} authenticated successfully`);


        return cb(null, googlePlayer);
    }catch(error){
        return cb(error);
    }   
}));

