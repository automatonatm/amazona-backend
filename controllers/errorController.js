const appError =  require('../utils/appError.js')

const sendDevError =  (err, res) => {
    console.log(err);
    res.status(err.statusCode)
        .json({
            status: err.status,
            message: err.message,
            err: err,
            stack: err.stack
        });

 
};

const sendProdError =  (err, res) => {

   // console.log((err))

    if(err.isOperational) {
        res.status(err.statusCode)
            .json({
                status: err.status,
                message: err.message,
            });
    }else{
        res.status(500).json({
            status: true,
            message: "Operation Failed!, Please Try Again",
        })
    }
};

const  handleCastErrorDB = (err) => {
   const  message = `Invalid ${err.path}: ${err.value}`;
    return new appError(message, 400 )
};

const handleDuplicateFieldDB = (err) => {

    //Get the error object and iterate
   const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')} Already exists`;
    return new appError(message, 400 )
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const  message = `${errors.join(' ')}`;
    //const  message = `Invalid input data.`;
    return new appError(message, 400);
}

const handleAuthError = (err) =>  new appError(err.message, 401);

const handleBadRequest = (err) =>  new appError(err.message, 400);

const handleForbidden = (err) =>  new appError(err.message, 403);

const handle404NotFound = (err) =>  new appError(err.message, 404);



module.exports =   (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || false;

    if(process.env.NODE_ENV === 'development') {

        sendDevError(err, res)

    }else if(process.env.NODE_ENV === 'production') {


        let error = { ...err };


       // console.log(error)

        if(err.name === 'CastError') error = handleCastErrorDB(error);

        if(err.code === 11000) error = handleDuplicateFieldDB(err);

        if(err.name === "ValidationError") error = handleValidationErrorDB(error);

        if(err.statusCode === 401) error = handleAuthError(err);

       if(err.statusCode === 400) error = handleBadRequest(err);

       if(err.statusCode === 403) error = handleForbidden(err);

       if(err.statusCode === 404) error = handle404NotFound(err);


       sendProdError(error, res)
    }


};

