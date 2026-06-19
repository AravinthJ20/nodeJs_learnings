const mongoose=require("mongoose")

const connectDB=()=>{

    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('db connected')
    } catch (error) {
        console.log('something went wrong')
    }
}

module.exports=connectDB