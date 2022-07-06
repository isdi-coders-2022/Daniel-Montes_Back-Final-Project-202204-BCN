const chalk = require("chalk");
const debug = require("debug")(chalk.white("AAP:Firebase"));

const { initializeApp } = require("firebase/app");

const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const fs = require("fs");
const path = require("path");

let messDescription = "";
let message = "";

const firebaseUploads = async (req, res, next) => {
  const { file } = req;
  const logPrefix = "User Request--> FIREBASE: ";

  const firebaseConfig = {
    apiKey: "AIzaSyArGWpvfmz5jBpnuRqM3hvCQr_r0fDhx9Y",
    authDomain: "adoptaunpinguino-69dcf.firebaseapp.com",
    projectId: "adoptaunpinguino-69dcf",
    storageBucket: "adoptaunpinguino-69dcf.appspot.com",
    messagingSenderId: "715282969976",
    appId: "1:715282969976:web:9cbcd8c736529293f3848d",
  };

  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const fullName = `${Date.now()}${file.originalname}`;
    const newImageName = fullName || "";
    message = `Receiving... ${newImageName}`;
    debug(`${logPrefix}${chalk.green(message)}`);

    message = `Received: ${newImageName}`;
    if (file) {
      message = `${logPrefix}${message}`;
      debug(chalk.green(message));

      await fs.rename(
        path.join("uploads", "images", file.filename),
        path.join("uploads", "images", newImageName),

        async (error) => {
          if (error) {
            const errorDescription = `Error: ${newImageName}. Error: ${error}`;
            message = `${logPrefix}${errorDescription}`;
            debug(chalk.red(message));

            next(error);
            return;
          }
          message = `${logPrefix}Uploading...: ${newImageName}`;
          debug(chalk.green(message));

          message = `${logPrefix}Reading...: ${newImageName}`;
          debug(chalk.green(message));

          await fs.readFile(
            path.join("uploads", "images", newImageName),

            async (readError, readFile) => {
              if (readError) {
                const errorDescription = `Error: ${newImageName}. Error: ${error}`;
                message = `${logPrefix}${errorDescription}`;
                debug(chalk.red(message));

                next(readError);
                return;
              }

              const storage = getStorage(firebaseApp);
              const storageRef = ref(storage, newImageName);

              message = `${logPrefix}UploadBytes...:${newImageName}`;
              debug(chalk.green(message));

              await uploadBytes(storageRef, readFile);

              messDescription = `getDownloadURL...:${newImageName}`;
              message = `${logPrefix}${messDescription}`;
              debug(chalk.green(message));

              const firebaseImageURL = await getDownloadURL(storageRef);

              req.imgBackup = firebaseImageURL;
              req.img = path.join("images", newImageName);

              message = `${logPrefix}Finished successfully.`;
              debug(chalk.green(message));

              next();
            }
          );
        }
      );
    } else {
      const errorDescription = `Error: ${newImageName}.No image found`;
      message = `${logPrefix}${errorDescription}`;
      debug(chalk.red(message));

      req.imgBackup = "";
      req.img = "";

      next();
    }
  } catch (err) {
    message = `${logPrefix}Error: ${err.message}`;
    debug(chalk.red(message));
  }
};

module.exports = firebaseUploads;
