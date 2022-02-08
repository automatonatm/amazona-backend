const  mongoose = require('mongoose');

const  connectDB = async () => {

    const connectionString = process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PRODUCTION;

    try {

        const conn = await mongoose.connect(connectionString, {
            useNewUrlParser:  true,
          /*  useCreateIndex: true,
            useFindAndModify: false,*/
            useUnifiedTopology: true
        });

        console.log(`DB connected: ${conn.connection.host}`)
    }catch (e) {
        console.log(`Connection Failed: ${e}`)
    }

};



module.exports = connectDB;