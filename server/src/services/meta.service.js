import Category from '../models/Category.js';
import Location from '../models/Location.js';

export const getCategories = async () => {
  return await Category.find().sort({ label: 1 }).lean();
};

export const getLocations = async () => {
  return await Location.find().sort({ city: 1, area: 1 }).lean();
};

