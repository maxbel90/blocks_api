const fs = require('fs');

const ArticleModel = require('../lib/mongoose').ArticleModel;

const articlesCrud = {
    get: function (req, res) {
        return ArticleModel.find(function (err, articles) {
            if (!err) {
                return res.send(articles);
            } else {
                res.statusCode = 500;
                return res.send({error: 'Server error'});
            }
        });
    },
    getByUrl: function (req, res) {
        return ArticleModel.find({ url: req.params.url }, function (err, article) {
            if (!err) {
                return res.send(article[0]);
            } else {
                res.statusCode = 500;
                return res.send({error: 'Server error'});
            }
        });
    },
    saveFromFile: function (req, res) {
        fs.readFile('data/articles.json', 'utf8', function (err, contents) {
            let dataFromFile = JSON.parse(contents);
            for (let article of dataFromFile) {
                let obj = new ArticleModel(article);
                obj.save();
            }
            return res.send({status: 'OK'});
        });
    }
};

module.exports = articlesCrud;