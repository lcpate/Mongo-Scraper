var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const exphbs = require("express-handlebars");
var Comment = require('./models/comment.js');
var Article = require('./models/article.js');
var request = require('request');

// Our scraping tools 
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


// Initialize Expresscd ..

var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;


if (process.env.MONGODB_URI) {
    console.log("TEST COMMENT");
    mongoose.connect(process.env.MONGODB_URI)

} else {
    mongoose.connect("mongodb://localhost/scraperdb", {
        useMongoClient: true
    })
}



app.get("/", function (req, res) {

    db.Article.find({ isSaved: false })
        .then(function (dbArticle) {
            var hbsObject = {
                articles: dbArticle
            };
           
            res.render("home", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/saved", function (req, res) {

    db.Article.find({ isSaved: true })
        .populate("comments")
        .then(function (dbArticle) {
            var hbsObject = {
                articles: dbArticle
            };
            // res.json(hbsObject);
            res.render("saved", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate("comments")
        .then(function (dbArticle) {
            var hbsObject = {
                article: dbArticle
            };
            res.json(hbsObject);
            res.render("saved", hbsObject);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.post("/save/:id", function (req, res) {
    db.Article.update({ _id: req.params.id }, { isSaved: true })
        .then(function (dbArticle) {

            res.redirect("/");
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/delete/:id", function (req, res) {
    db.Article.update({ _id: req.params.id }, { isSaved: false })
        .then(function (dbArticle) {

            res.redirect("/saved");
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {

    db.Comment.create(req.body)
        .then(function (dbComment) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.get("/scrape", function (req, res) {

    request("https://www.washingtonpost.com", function (error, response, html) {

        var $ = cheerio.load(html);

        $("div.contentItem__contentWrapper").each(function (i, element) {

            var result = {};

            result.headline = $(element).children("h1").text();
            result.summary = $(element).children("p").text();
            result.link = "www.washingtonpost.com" + $(element).parent("a").attr("href");


            if (result.link && result.headline && result.summary) {

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            }
        });

        res.redirect("/");
    });
});


var PORT = process.env.PORT || 3000;
// Listen on port 3000
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});