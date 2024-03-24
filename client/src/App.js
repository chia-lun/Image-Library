import React, { useState, useEffect } from "react";
import ImageUploadForm from "./components/ImageUploadForm";
import ImageList from "./components/ImageList";
import axios from "axios";
import syncImagesToBackend from "./helper-functions/syncImagesToBackend";
import "./App.css";

function App() {
  const [imageLibrary, setImageLibrary] = useState([]);
  let debounceTimeout;

  useEffect(() => {
    fetchImageLibrary();
  }, []);

  const fetchImageLibrary = async () => {
    await axios
      .get("http://localhost:3001/files",)
      .then((response) => {
        const jsonData = response.data;
        const formattedJsonData = JSON.stringify(jsonData, null, 2);
        setImageLibrary(jsonData);
        console.log("data fetched from server:" + formattedJsonData);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error fetching data:", error);
      });
  };

  const handleAction = async (id, action) => {
    try {
      // Update state based on API response
      updateImageState(id, action);
      // Make API call
      debounceSyncToBackend(id, action);
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  // convert this method into syncImageToBackend.js
  // this method was for updating actions on images
  // const updateImage = async (id, action) => {
  //   try {
  //     // Make API call to update image
  //     await axios.put(`http://localhost:3001/images/${id}`, action);
  //   } catch (error) {
  //     throw new Error("Failed to update image:", error);
  //   }
  // };

  const updateImageState = (id, action) => {
    setImageLibrary((prevLibrary) => {
      return prevLibrary
        .map((image) => {
          if (image.id === id) {
            switch (action.type) {
              case "FAVOURITE":
                return { ...image, favourite: action.payload };
              case "DELETE":
                return null;
              default:
                return image;
            }
          }
          return image;
        })
        .filter(Boolean);
    });
  };

  const handleImageUpload = (newImage) => {
    setImageLibrary((prevLibrary) => [newImage, ...prevLibrary]);
    debounceSyncToBackend(newImage.id, newImage.action);
  };

  const debounceSyncToBackend = (id, action) => {
    // Clear previous timeout
    clearTimeout(debounceTimeout);
    // Set new timeout to sync to the backend after 30 seconds
    debounceTimeout = setTimeout(syncToBackend(id, action), 30000);
  };

  const syncToBackend = (id, action) => {
    console.log("Syncing client-side state to the backend...");
    syncImagesToBackend(id, action);
  };

  return (
    <div className="App">
      <h1 className="App-header">Image Library</h1>
      <ImageUploadForm
        onUpload={handleImageUpload}
        fetchImageLibrary={fetchImageLibrary}
      />
      <ImageList images={imageLibrary} handleAction={handleAction} />
    </div>
  );
}

export default App;
