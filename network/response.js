exports.success = function(req, res, message, obj, status = 200) {
    let bodyMessage = obj;
    if (!status) {
        status = 200;
    }
    res.status(status).send({
        status: status,
        message: message,
        body: bodyMessage,
    });
};

exports.error = function(
    req,
    res,
    obj,
    status = 500
) {
    if (obj.code) {
        status = obj.code;
    }
    res.status(status).send({
        status: status,
        message: 'An error has occurred',
        body: obj,
    });
};