import React from "react";
import ImageCard from "./ImageCard";
import "../styles/ImageList.css";

const ImageList = ({ images, handleAction }) => {
  return (
    <div className="image-list">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} handleAction={handleAction} />
      ))}
    </div>
  );
};

export default ImageList;
