const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
// ejs-mate helps it easier to have templates for HTML content. Define layouts.
const Campground = require('./models/campground');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connection Open!!");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    } catch (e) {
        next(e); // Passes any error to the error handler middleware
    }
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Create endpoint for where the form is submitted to
app.post('/campgrounds', async (req, res, next) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        next(e); // Passes any error to the error handler middleware
    }
});

app.get('/campgrounds/:id', async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campground });
    } catch (e) {
        next(e); // Passes any error to the error handler middleware
    }
});

app.get('/campgrounds/:id/edit', async (req, res, next) => {
    try {
        console.log("Edit route accessed!"); // Debugging statement
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (e) {
        next(e); // Passes any error to the error handler middleware
    }
});

// Step necessary to update current element
// req.body.campground is expected to be an object containing the fields to update (e.g., { title: "New Title", location: "New Location" }).

// By using { ...req.body.campground }, you are creating a new object that contains all the key-value pairs from req.body.campground.

// The spread operator is used to create a new object rather than modifying the original req.body.campground directly. This is helpful for immutability, preventing unintended side effects.

// The first parameter (id) is the id of what I want to find and update, and the second parameter (which is the spread) is how I want to update it.
app.put('/campgrounds/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        next(e); // Passes any error to the error handler middleware
    }
});

app.delete('/campgrounds/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    } catch (e) {
        next(e); // Passes any error to the error handler middleware
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);  // This helps in debugging the error
    res.status(500).send("We got an error!");
});

app.listen(3000, () => {
    console.log("Serving on port 3000!!");
});
