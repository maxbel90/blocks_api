const mongoose = require('mongoose');
const config = require('./config');


mongoose.connect(config.get('mongoose:uri'));

const db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback() {
    console.log("Connected to DB!");
});

const Schema = mongoose.Schema;

// Schemas

const Advice = new Schema({
    articleUrl: {type: String, required: true},
    originalText: {type: String, required: true},
    usersText: {type: String, required: true},
    isApproved: {type: Boolean, required: true},
});

const Article = new Schema({
    url: {type: String, required: true},
    label: {type: String, required: true},
    blocks: {type: Array, required: false}
});

const AdviceModel = mongoose.model('advice', Advice);
const ArticleModel = mongoose.model('article', Article);


module.exports.AdviceModel = AdviceModel;
module.exports.ArticleModel = ArticleModel;