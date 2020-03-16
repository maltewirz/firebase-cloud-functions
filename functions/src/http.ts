import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();

import * as express from 'express';
import * as cors from 'cors';

export const basicHTTP2 = functions.https.onRequest((request, response) => {
    const name = request.query.name;

    if (!name) {
        response.status(400).send('You must supply a name or two')
    } else {
        response.send(`Hello there ${name}`);
    }
    
});

const auth = (request, response, next) => {
    console.log('inside middleware');
    
    // if (!request.header.authorization) {
    //     response.status(400).send('unauthorized')
    // }
    next()
}


const app = express();
app.use(cors({ origin: true)});
app.use(auth);

app.get('/cat', (request, response) => {
    response.send('CAT');
});

app.get('/dog', (request, response) => {
    response.send('CAT');
});

export const api = functions.https.onRequest(app);