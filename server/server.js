const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Line 13-27: code to prevent Cross-Origin Request Blocked
// also in package.json, "proxy": "http://localhost:3001" does the same thing
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
  next();
});

const corsOrigin = "http://localhost:3000";
app.use(
  cors({
    origin: [corsOrigin],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

// Line 31-88, take image file from the frontend client side
// create metadata and save it to image.json
// also save images in image folder on the backend 
const imageUploadPath = "./data/images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${file.fieldname}_dateVal_${Date.now()}_${
      file.originalname
    }`;
    cb(null, filename);

    // Construct the URL where the image can be accessed
    const imageUrl = `http://localhost:${PORT}/data/images/${filename}`;

    // Generate a unique ID for the image
    const id = `img_${Date.now()}`;

    // Extract title from original filename (you can implement your own logic)
    const title = file.originalname.split(".")[0]; // Example: Extract filename without extension

    // Collect metadata
    const metadata = {
      id: id,
      title: title,
      filename: filename,
      url: imageUrl,
      favourite: false,
      // Add more metadata properties as needed
    };

    // Save the metadata to a JSON file
    const jsonFilePath = path.join(__dirname, "data", "image.json");
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
      let jsonData = [];
      if (!err && data) {
        jsonData = JSON.parse(data);
      }
      jsonData.push(metadata);
      fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          // Handle error
          console.error("Error saving metadata:", err);
        }
        console.log("Metadata saved successfully.");
      });
    });
  },
});

const imageUpload = multer({ storage: storage });

app.post("/upload", imageUpload.single("my-image-file"), (req, res) => {
  console.log("POST request received to /image-upload.");
});

//////////////////////////////////////////////////////////////////

// fetch data from image folder and image.json and access them on the client side 
app.use("/data/images", express.static(path.join(__dirname, "data", "images")));
// Route to get all uploaded files
app.get("/files", (req, res) => {
  const filePath = path.join(__dirname, "data", "image.json"); // Path to JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).send("Error reading JSON file.");
      return;
    }
    if (!err && data) {
      const jsonData = JSON.parse(data);
      const formattedJsonData = JSON.stringify(jsonData, null, 2);
      console.log("json parse data:" + formattedJsonData);
      res.json(jsonData);
    }
  });
});

//////////////////////////////////////////////////////////////////

// handle action (set favourite and delete) from the client side 
// and modify attributes in image.json and delete images in the folder if 
// the action in deletion
app.use("/data/image.json", express.static(path.join(__dirname, "data", "image.json")));
const jsonFilePath = path.join(__dirname, 'data', 'image.json'); // Path to your JSON file
app.put("/images/:id", (req, res) => {
  console.log("check connection of app.put");
  const { id } = req.params;
  const { type, payload } = req.body;
  console.log("id:" + req.params);
  console.log("type, payload" + req.body);

  // Read the JSON file
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send({ message: "Failed to update image" });
    }

    let images = [];
    try {
      images = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).send({ message: "Failed to update image" });
    }

    // Find the index of the image with the specified ID
    const index = images.findIndex((image) => image.id === id);
    if (index === -1) {
      return res.status(404).send({ message: "Image not found" });
    }

    // Update the image based on the action type
    switch (type) {
      case "FAVOURITE":
        images[index].favourite = payload;
        break;
      case "DELETE":
        const filenameToDelete = images[index].filename;
        const imagePathToDelete = path.join("./data/images", filenameToDelete);
        fs.unlink(imagePathToDelete, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting image file:', unlinkErr);
            // You can choose to continue with the deletion process even if deleting the file fails
          }
        });
        // Remove the image from the array
        images.splice(index, 1);
        break;
      default:
        return res.status(400).send({ message: "Invalid action type" });
    }

    // Write the updated JSON data back to the file
    fs.writeFile(
      jsonFilePath,
      JSON.stringify(images, null, 2),
      (writeError) => {
        if (writeError) {
          console.error("Error writing JSON file:", writeError);
          return res.status(500).send({ message: "Failed to update image" });
        }

        // Respond with success message
        res.status(200).send({ message: "Image updated successfully" });
      }
    );
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
