# Image Library 

## Demo
https://github.com/chia-lun/Image-Library/assets/54944966/869b4ff3-a2ac-4c7a-b1a1-d500a67a03c6

## Instruction 
### Installation and host locally 
```
// before running, make sure both client and server sides have node installed 
// navigate to client directory

cd client
npm install

// open a new terminal and navigate to servere directory (backend)

cd server
npm install
```
```
// in your terminal, go to the backend folder and run the server for calling API on the frontend

cd server 
node server.js

// open another terminal and run the client side

cd client
npm start
```
## Features
#### 1. Upload images to the server 
In the “Upload Image” section on the page, you can click “browse” and select images locally to upload them to the server. 

##### Implmentation
1. On the client side, the image file will be converted to ‘FormData’ and then an HTTP POST request is made using the Axios library, sending the `selectedFile` data in the request body, and configuring the request with a timeout of 50 seconds.
2. On the server side, the sent ‘FormData’ is stored in the ‘data/images’ directory in the server and make a metadata to write it in ‘image.json’ for fetching and modification.

#### 2. Fetch images from the server 
Image data was automatically from the server and display them on the user side after uploading the images and taking actions on the images. 

##### Implmentation
To achieve this responsive interaction between the client and the server, the metadata are got from ‘image.json’ and sent as ‘JSON object’ with an HTTP GET request using Axios. 

#### 3. User actions on the images
1. Favorite: A user can favorite and un-favorite an image and that change will be updated on the server. 
2. Delete: A user can delete an image from the interface and the server local storage.

##### Implmentation
The ‘handleAction(id, action)’ function helps to call ‘updateImageState(id, action)’ and ‘syncImagesToBackend(id, action)’ to make changes on the client side and server side. 

#### 4. Debouncing mechanism
A debouncing mechanism is implemented for when users take actions on the images so that the client side state can be synced to the backend every 30s to avoid any laggy user experience. 

##### Implmentation
A ‘debounceSyncToBackend(id, action)’ is created to call ‘syncImagesToBackend(id, action)’ function every 30s, which updates the actions on the server side.

## Future improvements
### Timeout with server
##### Issue 
Sometimes the server took longer to respond to the request, resulting in the Axios request being aborted due to the timeout. 
##### Improvement
1. Optimize Server Performance: Since there is database queries, function logic, or cache frequently accessed data can be improved.
2. Use Asynchronous Processing: Utilize asynchronous processing techniques (e.g., asynchronous I/O, non-blocking operations) in the server-side code to handle requests more efficiently and avoid blocking the event loop.
