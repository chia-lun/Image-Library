import React from 'react';
import "../styles/ActionButton.css";

const ActionButton = ({ imageId, handleAction, favourite, discard }) => {
  const handleFavourite = () => {
    handleAction(imageId, { type: 'FAVOURITE', payload: !favourite });
  };

  const handleDiscard = () => {
    handleAction(imageId, { type: 'DELETE', payload: discard });
  };

  return (
    <div className="action-buttons">
      <button className="button" onClick={handleFavourite}>{favourite ? 'Unfavourite' : 'Favourite'}</button>
      {/* <button className="favorite-button" onClick={handleFavourite}>🤍</button> */}
      <button className="button" onClick={handleDiscard}>Delete</button>
      {/* Implement UI for other actions */}
    </div>
  );
};

export default ActionButton;

