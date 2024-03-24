import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ImageUploadForm.css";

const ImageUploadForm = ({ fetchImageLibrary }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [rerenderTrigger, setRerenderTrigger] = useState(false);

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    const formData = new FormData();
    formData.append(
      "my-image-file",
      event.target.files[0],
      event.target.files[0].name
    );
    setSelectedFile(formData);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    try {
      console.log("formdata" + selectedFile);
      axios.post("http://localhost:3001/upload", selectedFile);
      fetchImageLibrary();
      console.log("call fetchImageLibrary");
      alert("Image uploaded successfully!");
      setRerenderTrigger(!rerenderTrigger);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  useEffect(() => {
    fetchImageLibrary();
  }, [rerenderTrigger, fetchImageLibrary]);

  return (
    <div className="ImageUploadForm">
      <h2>Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUploadForm;
