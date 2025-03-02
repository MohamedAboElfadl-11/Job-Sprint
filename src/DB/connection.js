import mongoose from "mongoose";

const database_connection = () => {
    try {
        mongoose.connect(process.env.DB_URL)
        console.log(`Database Connected db_jobSearch_app ✅`)
    } catch (err) {
        console.log(`Connection Failed ❌`)
    }
}

export default database_connection