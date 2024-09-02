const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
// ejs-mate helps it easier to have templates for HTML content. Define layouts.
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
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

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
    console.log(result);
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async(req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Create endpoint for where the form is submitted to
app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
    //if there is nothing posted for the new campground, like say you enter nothing
       //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async(req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
        console.log("Edit route accessed!"); // Debugging statement
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
}));

// Step necessary to update current element
// req.body.campground is expected to be an object containing the fields to update (e.g., { title: "New Title", location: "New Location" }).

// By using { ...req.body.campground }, you are creating a new object that contains all the key-value pairs from req.body.campground.

// The spread operator is used to create a new object rather than modifying the original req.body.campground directly. This is helpful for immutability, preventing unintended side effects.

// The first parameter (id) is the id of what I want to find and update, and the second parameter (which is the spread) is how I want to update it.
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
}));

//if a route doesn't exist do 404
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not found', 404));
})

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message){
        err.message = 'Oh no, Something Went Wrong!'
    }
    res.status(statusCode).render('error', {err});
});

app.listen(3000, () => {
    console.log("Serving on port 3000!!");
});
