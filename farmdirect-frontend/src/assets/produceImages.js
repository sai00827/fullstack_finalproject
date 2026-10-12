import freshProduce from "./freshproduce.jpeg";
import tomatoes from "./tomatoes.jpeg";
import fruits from "./fruits.jpeg";
import grains from "./grains.jpeg";
import pulses from "./pulses.jpeg";
import oils from "./oils.jpeg";
import dairy from "./dairy.jpg";
import all from "./all.jpeg";

export const heroImage = freshProduce;

const categoryImages = {
  vegetables: tomatoes,
  fruits,
  grains,
  pulses,
  oils,
  dairy,
  groceries: all,
};

export function categoryImage(category) {
  return categoryImages[category] || null;
}