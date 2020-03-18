import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as twilio from 'twilio';

const credentials = functions.config().twilio

const client = new twilio.Twilio(credentials.sid, credentials.token);

const db = admin.firestore();

export const sendText = functions.https.onCall(async (data, context) => {
    const userId = context.auth?.uid;

    const userRef = db.doc(`users/${userId}`);

    const userSnap = await userRef.get();

    const number = userSnap.data()?.phoneNumber;

    return client.messages.create({
        body: data.message,
        to: number,
        from: '+1234567890'
    })
})