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
    const newImageName = `${file ? `${file.originalname}` : ""}`;

    debug(`${logPrefix}${chalk.green(`Receiving image... ${newImageName}`)}`);

    if (file) {
      debug(`${logPrefix}${chalk.green(`Received image: ${newImageName}`)}`);

      await fs.rename(
        path.join("uploads", "images", file.filename),
        path.join("uploads", "images", newImageName),

        async (error) => {
          if (error) {
            debug(
              `${logPrefix}${chalk.red(
                `Error: ${newImageName}. Error: ${error}`
              )}`
            );

            next(error);
            return;
          }
          debug(
            `${logPrefix}${chalk.green(`Uploading image: ${newImageName}`)}`
          );
          try {
            debug(
              `${logPrefix}${chalk.green(`Reading image: ${newImageName}`)}`
            );

            await fs.readFile(
              path.join("uploads", "images", newImageName),

              async (readError, readFile) => {
                if (readError) {
                  debug(
                    `${logPrefix}${chalk.red(
                      `Error: ${newImageName}. Error: ${error}`
                    )}`
                  );

                  next(readError);
                  return;
                }

                const storage = getStorage(firebaseApp);
                debug(`${logPrefix}${chalk.green(`Storage: ${newImageName}`)}`);
                const storageRef = ref(storage, newImageName);
                debug(
                  `${logPrefix}${chalk.green(`Image Ref: ${newImageName}`)}`
                );

                try {
                  debug(`${logPrefix}${chalk.green(`UploadBytes start...`)}`);
                  await uploadBytes(storageRef, readFile);
                } catch (errorUploadBytes) {
                  debug(
                    `${logPrefix}${chalk.red(
                      `Error: ${errorUploadBytes.message}`
                    )}`
                  );
                }
                debug(
                  `${logPrefix}${chalk.green(
                    `getDownloadURL start: ${newImageName}`
                  )}`
                );
                const firebaseImageURL = await getDownloadURL(storageRef);

                req.imgBackup = firebaseImageURL;
                req.img = path.join("images", newImageName);
                debug(`${logPrefix}${chalk.green(`Uploaded successfully.`)}`);

                next();
              }
            );
          } catch (err) {
            debug(
              `${logPrefix}${chalk.red(
                `Error: ${newImageName}. Error: ${error.message}`
              )}`
            );
          }
        }
      );
    } else {
      debug(
        `${logPrefix}${chalk.red(`Error: ${newImageName}.No image found`)}`
      );
      req.imgBackup = "";
      req.img = "";

      next();
    }
  } catch (err) {
    debug(`${logPrefix}${chalk.red(`Error: ${err.message}`)}`);
  }
};

module.exports = firebaseUploads;
