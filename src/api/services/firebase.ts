import admin from "firebase-admin"

const keys = {
    "type": "service_account",
    "project_id": "nautilus-pro",
    "private_key_id": process.env.FIREBASE_KEY_ID,
    "privateKey": process.env.FIREBASE_KEY.replace(/\\n/g, "\n"),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": "113164375107303763660",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
}

admin.initializeApp({
    credential: admin.credential.cert(keys)
})