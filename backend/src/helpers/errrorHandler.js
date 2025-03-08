//error handler middleware

const errorHandler = (err, req, res, next) => {
  //check if response headers have already been sent to client
  if (res.headersSent) {
    //if true pass error to next error handling middleware
    return next(err);
  }

  const statusCode =
    res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode); //set status code of response

  //log error stack trace in console
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
