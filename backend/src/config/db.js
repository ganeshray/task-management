import mongoose from "mongoose";
mongoose.set("strictQuery", false);

export const connectDB = async () => {
    const dbUrl = process.env.MONGO_URI;
    if (!dbUrl) {
        console.error("MongoDB URI (MONGO_URI) is not defined in environment variables.");
        process.exit(1);
    }
    try {
        console.log("🔄 Attempting to connect to MongoDB...");
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Connecting to database: ${dbUrl.includes('task_management_prod') ? 'Production DB' : 'Development DB'}`);
        const con = await mongoose.connect(dbUrl);
        console.log(`✅ MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.error("💡 Possible solutions:");
        console.error("   1. Check your internet connection");
        console.error("   2. Verify your MongoDB Atlas IP whitelist");
        console.error("   3. Check if your firewall blocks MongoDB ports");
        process.exit(1);
    }
};