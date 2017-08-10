let express = require('express'),
    cors = require('cors'),
    app = express(),
    config = require('./lib/config'),
    bodyParser = require('body-parser'),
    adviceCrud = require('./advice/crud'),
    articlesCrud = require('./articles');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors({origin: config.get('origin')}));

app.use(function(req, res, next) {
    req.url = req.url.replace(/^(\/api\/article\/)(.+)/, function($0, $1, $2) {
        return $1 + encodeURIComponent($2);
    });
    next();
});

app.get('/api/advice', adviceCrud.get);

app.get('/api/articles', articlesCrud.get);
app.get('/api/article/:url', articlesCrud.getByUrl);

app.post('/api/advice-from-file', adviceCrud.saveFromFile);
app.post('/api/articles-from-file', articlesCrud.saveFromFile);

app.post('/api/article/:url', adviceCrud.saveAdvice);

app.put('/api/advice/:id', adviceCrud.approveAdvice);
app.delete('/api/advice/:id', adviceCrud.deleteAdvice);

app.listen(config.get('port'), function () {
    console.log('Express server listening on port ' + config.get('port'));
});