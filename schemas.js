const Joi = require('joi');

//bc u expect the thing to look like 


       //campground : {
        // title:'akakak',
        //price: 3;
      // }

      //this is useful if ppl somehow get passed the client side validation: SERVER SIDE VALIDATION
      module.exports.campgroundSchema = Joi.object({
        campground : Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required,
            location: Joi.string().required()
        }).required()
   })


