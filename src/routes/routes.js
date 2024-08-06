const appRouter = require('express').Router();
const userRouter = require('./userRouter/userRouter');

appRouter.use('/users', userRouter);

module.exports = appRouter;