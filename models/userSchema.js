//importing  mongoose
const mongoose = require('mongoose')

//importing validator
const validator = require('validator')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,

        // email validation
        validator(value) {
            if (!validator.isEmail(value)) {
                throw Error("invalid email")
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    gender:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    selectedCourses: {
        type: [String],
        required: true
    },
    profile:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true

    }

})

// creating object for model creation
// model name is same as mongodb collection name

const users= new mongoose.model('employees',userSchema)

// for exoprting user(model)
module.exports=users