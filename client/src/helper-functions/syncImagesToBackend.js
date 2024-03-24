import axios from "axios";

// debouncing mechanism to sync the client side state to the backend every 30s or so
const syncImagesToBackend = async (id, action) => {
  try {
    // Make API call to update image
    await axios.put(`http://localhost:3001/images/${id}`, action);
    console.log("Image data synced to the backend successfully.");
  } catch (error) {
    console.error("Error syncing image data to the backend:", error);
  }
};

export default syncImagesToBackend;
