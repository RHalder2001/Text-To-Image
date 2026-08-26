import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables')
        }

        mongoose.connection.on('connected', () => console.log('Database Connected'))
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error.message)
        })

        await mongoose.connect(process.env.MONGODB_URI)
        return true
    } catch (error) {
        console.error('Database connection failed:', error.message)
        console.error(error)
        return false
    }
}

export default connectDB
