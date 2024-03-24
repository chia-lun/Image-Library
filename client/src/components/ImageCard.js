import React from "react";
import ActionButton from "./ActionButton";
import "../styles/ImageCard.css";

const ImageCard = ({ image, handleAction }) => {
  const { id, title, favourite, discard } = image;

  return (
    <div className="image-card">
      <div className="image-card__image-container">
        <img src={image.url} alt={title} className="image-card__image" />
      </div>
      <div className="image-card__content">
        <h3 className="image-card__title">{title}</h3>
        <ActionButton
          imageId={id}
          handleAction={handleAction}
          favourite={favourite}
          discard={discard}
        />
      </div>
    </div>
  );
};

export default ImageCard;
