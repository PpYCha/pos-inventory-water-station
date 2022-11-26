const admin = require("firebase-admin");
const serviceAccount = require("./water-pos-60b3d-firebase-adminsdk-6g4en-ad745c12bd.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "some-uid";
const additionalClaims = {
  premiumAccount: true,
};

admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    console.log(customToken);
  })
  .catch((error) => {
    console.log("Error creting custom token:", error);
  });
