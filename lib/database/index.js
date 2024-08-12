import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

//* Here we are caching our database connection using this cached variable. If the connection is already present, the server will use the same connection and will not be sending new connection request to the database, while if the connection is not present, new connection request is made.

//if connection is not done, set it as an empty object
let cached = global.mongoose || {conn: null, promise: null}

export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn

    if(!MONGODB_URI) throw new Error("MONGODB_URI is missing")

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'shopnest',
        bufferCommands: false
    })

    cached.conn = await cached.promise
    return cached.conn;
}

