import { categoryImage } from "../assets/produceImages";
import { ProduceArt } from "./ProduceArt";

export function ProduceImage({ name, alt = "" }) {
  const source = categoryImage(name);
  if (!source) return <ProduceArt name={name} title={alt} />;
  return <img src={source} alt={alt} loading="lazy" decoding="async" />;
}