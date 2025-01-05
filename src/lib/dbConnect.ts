import mongoose, { connections } from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

export const dbConnect = async () => {
    if (connection.isConnected) {
        console.log("already connected to database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {})
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to database");
    } catch (error) {
        throw new Error("Error in connecting to database");
        process.exit(1);
    }
};

export default dbConnect;