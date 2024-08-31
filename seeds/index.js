const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:' ));
db.once('open', function(){
    console.log("Connection in this database!!"); 
})

//get random element in array
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i< 50; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae alias, aperiam dolorem ipsum ducimus pariatur error molestias nisi numquam iste odio neque, nam, quia nesciunt at consequuntur dignissimos maxime. Itaque.",
            price
        })

        await camp.save();
   }
}

//instead of the database keep running, this is how you close it
seedDB().then(() =>{
    mongoose.connection.close();
})