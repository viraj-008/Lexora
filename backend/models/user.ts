import mongoose,{Document, Schema} from "mongoose";
import bcrypt from 'bcrypt'


export interface  IUSER extends Document {
 name:string,
 email:string,
 password:string,
 googleId:string,
 profilePicture:string,
 phoneNumber:string,
 isVerified:boolean,
 verificationToken:string,
 resetPasswordToken?:string,
 resetPasswordExpires?:Date,
 agreeTerm:boolean,
 addresses:mongoose.Types.ObjectId[],
 comparePassword(candidatePassword:string):Promise<boolean>
}

const userSchema = new Schema<IUSER>({
    name:{type:String,requird:true},
    email:{type:String,requird:true,unique:true},
    password:{type:String},
    googleId:{type:String},
    profilePicture:{type:String,default:null},
    phoneNumber:{type:String, default:null},
    isVerified:{type:Boolean,default:false},
    agreeTerm:{type:Boolean,default:false},
    verificationToken:{type:String,default:null},
    resetPasswordExpires:{type:Date,default:null},
    resetPasswordToken:{type:String,default:null},
    addresses:[{type:Schema.Types.ObjectId,ref:"Address"}]



},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password!,salt)
    next();
})

userSchema.methods.comparePassword = async function (candidatePassword:string) : Promise<boolean>{
    return bcrypt.compare(candidatePassword,this.password)
}

export default mongoose.model<IUSER>('User',userSchema)