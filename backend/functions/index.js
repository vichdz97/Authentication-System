const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({origin: true}));

/** ROUTES **/

// Create (POST) new user
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      // get all users
      const response = [];
      await db.collection("users").get().then((snapshot) => {
        const docs = snapshot.docs; // the result of the query
        for (const doc of docs) {
          const selectedDoc = {
            id: doc.id,
            username: doc.data().username,
            password: doc.data().password,
            role: doc.data().role,
            hiddenPwd: doc.data().hiddenPwd,
          };
          response.push(selectedDoc);
        }
        return response; // each then should return a value
      });

      // get the last user's ID and increment it
      const lastUser = response[response.length - 1];
      const newID = (parseInt(lastUser.id) + 1).toString();
      await db.collection("users").doc("/" + newID + "/")
          .create({
            id: newID,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            hiddenPwd: req.body.hiddenPwd,
          });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read (GET) a specific user based on ID
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      const user = await document.get();
      const response = user.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read (GET) all users
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("users");
      const response = [];

      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs; // the result of the query
        for (const doc of docs) {
          const selectedDoc = {
            id: doc.id,
            username: doc.data().username,
            password: doc.data().password,
            role: doc.data().role,
            hiddenPwd: doc.data().hiddenPwd,
          };
          response.push(selectedDoc);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Update (PUT) user
app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      await document.update({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        hiddenPwd: req.body.hiddenPwd,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Delete (DELETE) user
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Exports api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
