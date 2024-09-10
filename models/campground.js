const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: {
        type:String,
        default: 'https://images.app.goo.gl/P2qLLTJMusUmRanX7' 
    },
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref : 'Review'
        }
    ]
}, {
    default: { reviews: [] }  // Ensures that reviews is always an empty array
});

CampgroundSchema.post('findOneAndDelete', async function(){
    if(doc){
       await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
       }) 
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);

