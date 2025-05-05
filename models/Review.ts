import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: [{
    type: String,
    url: String,
  }],
  sentiment: {
    score: Number,
    label: String,
  },
  keywords: [String],
  summary: String,
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema); 