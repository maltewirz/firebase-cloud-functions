import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const gameCount = functions.firestore
    .document('games/{gameId}')
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();
        if (data) {
            const userRef = db.doc(`users/${data.uid}`);
            const userSnap = await userRef.get();
            const userData = userSnap.data();
            
            if (userData) {
                return userRef.update({
                    gameCount: userData.gameCount + 1
                });
            } else {
                return
            }
        } else {
            return
        }
    })

export const userTrend = functions.firestore
    .document('games/{gameId}')
    .onUpdate((snapshot, context) => {
        const before = snapshot.before.data();
        const after= snapshot.after.data();

        let trend;
        if (after && before) {
            if (after.score >= before.score) {
                trend = 'you are improving :)';
            } else {
                trend = 'you are on the decline :(';
            }
    
            const userRef = db.doc(`users/${after.uid}`);
            return userRef.update({
                trend
            });
        } else {
            return
        }
      
    })