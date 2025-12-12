import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['Haircut', 'Laundry', 'Electronics', 'Fashion', 'Market'],
    },
    label: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model('Category', categorySchema);

