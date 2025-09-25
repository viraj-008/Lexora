import passport from 'passport'
import { Strategy as GoogleStrategy,Profile } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import { IUSER } from '../../models/user'
import User from '../../models/user'
import { Request } from 'express'

dotenv.config()

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID || '',
    clientSecret:process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL:process.env.GOOGLE_CALLBACK_URL || '',
    passReqToCallback:true,
},

async(
    req:Request,
    accessToken,
    refreshToken,
    profile,
    done:(error:any,user?:IUSER | false ) => void
)=>{
    const {emails,displayName,photos} = profile
    console.log('that is my profile,',profile)
    try{
        let user = await User.findOne({email:emails?.[0]?.value})
        if(user){
             if(!user.profilePicture && photos?.[0]?.value){
                user.profilePicture = photos?.[0]?.value
                await user.save()
             }

             return done(null,user)
        }

        user= await User.create({
            googleId:profile.id,
            name:displayName,
            email:emails?.[0]?.value,
            profilePicture:photos?.[0]?.value,
            isVerified:true,
            agreeTerm:true
        })

        done(null,user)
    }catch(error){
   console.log(error)
   done(error)
    }
}

))