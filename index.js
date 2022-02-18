const express =  require('express');
const morgan =  require('morgan');
const path = require('path');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const  app = express();
const  AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


//Routes
const productRoutes = require('./routes/productRoute')
const userRoutes = require('./routes/userRoute')
const authRoutes = require('./routes/authRoute')
const orderRoutes = require('./routes/orderRoute')
const categoryRoutes = require('./routes/categoryRoute')



//const __dirname = path.resolve();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Serving static files

app.use(express.static(path.join(__dirname, 'public')));

//Set View Engines


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


//Body Parser, reading data from the body into req.body
app.use(express.json({limit: '10000kb'}));



//Cookie Passer allows data to be passed as cookies
app.use(cookieParser());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))


// parse application/json
app.use(bodyParser.json())



app.use(cors());


app.options('*', cors());

//set Routes
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/categories', categoryRoutes)

app.use('/api/v1/config/paypal', (req, res)  => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})



//Handle 404 routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});


app.use(globalErrorHandler);

module.exports =  app;