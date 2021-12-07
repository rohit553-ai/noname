const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type:"String",
        required: true
    },
    email: {
        type:"String",
        required: true
    },
    password: {
        type:"String",
    },
    isVerified: {
        type:"Boolean",
        default: false
    },
    passwordChangedAt: Date
});
userSchema.methods.comparePassword = async function(candidatePassword){
    console.log(this.password, candidatePassword);
    console.log(bcrypt.compareSync(candidatePassword, this.password));
    if(bcrypt.compareSync(candidatePassword, this.password)){
       return true; 
    }
    return false;
}
userSchema.methods.changedPassword = function(timestamp){
    if(this.passwordChangedAt){
        let formattedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return formattedTimeStamp > timestamp;
    }    
    return false;
}

userSchema.statics.userWithIdPresent = async function(userId){
    const user = await User.findById(userId);
    if(!user){
        return false;
    }
    return true;
}

const User = mongoose.model("User", userSchema);

module.exports = User;