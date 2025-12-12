import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
  }
);

locationSchema.index({ city: 1, area: 1 }, { unique: true });

export default mongoose.model('Location', locationSchema);
