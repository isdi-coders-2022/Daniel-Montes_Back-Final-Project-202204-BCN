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
    const newImageName = `${file} || ${file.originalname}`;
    message = `Receiving image... ${newImageName}`;
    debug(`${logPrefix}${chalk.green(message)}`);

    message = `Received image: ${newImageName}`;
    if (file) {
      debug(`${logPrefix}${chalk.green(message)}`);

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
          message = `${logPrefix}Uploading image: ${newImageName}`;
          debug(chalk.green(message));

          message = `${logPrefix}Reading image: ${newImageName}`;
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
              message = `${logPrefix}Storage: ${newImageName}`;
              debug(chalk.green(message));

              const storageRef = ref(storage, newImageName);

              message = `${logPrefix}Image Ref: ${newImageName}`;
              debug(chalk.green(message));

              message = `${logPrefix}UploadBytes start...`;
              debug(chalk.green(message));

              await uploadBytes(storageRef, readFile);
              messDescription = `${logPrefix}getDownloadURL start: ${newImageName}`;
              message = chalk.green(messDescription);
              debug(message);

              const firebaseImageURL = await getDownloadURL(storageRef);

              req.imgBackup = firebaseImageURL;
              req.img = path.join("images", newImageName);

              messDescription = `${logPrefix}Uploaded successfully.`;
              message = chalk.green(messDescription);
              debug(message);

              next();
            }
          );
        }
      );
    } else {
      const errorDescription = `Error: ${newImageName}.No image found`;
      message = `${logPrefix}${chalk.red(errorDescription)}`;
      debug(message);

      req.imgBackup = "";
      req.img = "";

      next();
    }
  } catch (err) {
    const errorDescription = chalk.red(`Error: ${err.message}`);
    message = `${logPrefix}${errorDescription}`;
    debug(message);
  }
};

module.exports = firebaseUploads;
