export function notFoundError(req,res,next)
{
const err = new Error(" Not found");
err.status = 404;
next(err);
};

export function errorHandler(err,req,res,next){
    res.status(err.status ).json(
        {
            message:err.message,
        }
    );
};