const { initializeApp } = require("firebase/app");

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const fs = require("fs");
const path = require("path");

const firebaseUploads = async (req, res, next) => {
  const { file } = req;

  const firebaseConfig = {
    apiKey: "AIzaSyArGWpvfmz5jBpnuRqM3hvCQr_r0fDhx9Y",
    authDomain: "adoptaunpinguino-69dcf.firebaseapp.com",
    projectId: "adoptaunpinguino-69dcf",
    storageBucket: "adoptaunpinguino-69dcf.appspot.com",
    messagingSenderId: "715282969976",
    appId: "1:715282969976:web:9cbcd8c736529293f3848d",
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const newImageName = file ? `${Date.now()}${file.originalname}` : "";

  if (file) {
    await fs.rename(
      path.join("uploads", "images", file.filename),
      path.join("uploads", "images", newImageName),
      async (error) => {
        if (error) {
          next(error);
          return;
        }

        await fs.readFile(
          path.join("uploads", "images", newImageName),
          async (readError, readFile) => {
            if (readError) {
              next(readError);
              return;
            }

            const storage = getStorage(firebaseApp);

            const storageRef = ref(storage, newImageName);

            await uploadBytes(storageRef, readFile);

            const firebaseImageURL = await getDownloadURL(storageRef);

            req.imgBackup = firebaseImageURL;
            req.img = path.join("images", newImageName);

            next();
          }
        );
      }
    );
  } else {
    req.imgBackup = "";
    req.img = "";
    next();
  }
};

module.exports = firebaseUploads;
