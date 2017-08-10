const fs = require('fs');

const AdviceModel = require('../lib/mongoose').AdviceModel;

const adviceCrud = {
    get: function (req, res) {
        return AdviceModel.find({isApproved: false}, function (err, advice) {
            if (!err) {
                return res.send(advice);
            } else {
                res.statusCode = 500;
                return res.send({error: 'Server error'});
            }
        });
    },
    saveFromFile: function (req, res) {
        fs.readFile('data/advice.json', 'utf8', function (err, contents) {
            let dataFromFile = JSON.parse(contents);
            for (let advice of dataFromFile) {
                let obj = new AdviceModel(advice);
                obj.save();
            }
            return res.send({status: 'OK'});
        });
    },
    saveAdvice: function (req, res) {
        let advice = new AdviceModel({
            articleUrl: req.body.articleUrl,
            originalText: req.body.originalText,
            usersText: req.body.usersText,
            isApproved: false
        });

        advice.save(function (err) {
            if (!err) {
                console.log("advice created");
                return res.send({status: 'OK'});
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                console.log('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    },
    approveAdvice: function (req, res) {
        return AdviceModel.findById(req.params.id, function (err, advice) {
            if (!advice) {
                res.statusCode = 404;
                return res.send({error: 'Not found'});
            }
            advice.isApproved = true;
            return advice.save(function (err) {
                if (!err) {
                    console.log("advice approved");
                    return res.send({status: 'OK'});
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({error: 'Server error'});
                }
            });
        });
    },
    deleteAdvice: function (req, res) {
        return AdviceModel.findById(req.params.id, function (err, advice) {
            if (!advice) {
                res.statusCode = 404;
                return res.send({error: 'Not found'});
            }
            return advice.remove(function (err) {
                if (!err) {
                    console.log("advice removed");
                    return res.send({status: 'OK'});
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({error: 'Server error'});
                }
            });
        })
    }

};

module.exports = adviceCrud;