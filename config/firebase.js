const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // No necesitas databaseURL aquí si usas Firestore
});

const db = admin.firestore(); // Inicializa Firestore
module.exports = {admin, db};