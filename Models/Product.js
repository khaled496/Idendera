
import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  Image: {
    type: String,
    
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
  },
  AR : {
    type: Boolean
  },
  Seller : 
  {
    type : String 
  }
  
});

const Product = mongoose.model('Product', ProductSchema);

export { Product, ProductSchema };
