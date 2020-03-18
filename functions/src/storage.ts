import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

import * as storage from '@google-cloud/storage'
const gcs = new storage.Storage();

// import * as fs from 'fs-extra';

import { tmpdir } from 'os';
import { join } from 'path';

import * as sharp from 'sharp';


export const resizeAvatar = functions.storage
    .object()
    .onFinalize( async object => {
        const bucket = gcs.bucket(object.bucket);

        const filePath = object.name;
        if (filePath && object.name) {
            const fileName = filePath.split('/').pop();
            const tmpFilePath = join(tmpdir(), object.name);
    
            const avatarFileName = 'avatar_' + fileName;
            const tmpAvatarPath = join(tmpdir(), avatarFileName);
    
            if (fileName?.includes('avatar_')) {
                console.log('exiting function');
                return false;
            }
    
            await bucket.file(filePath).download({
                destination: tmpFilePath
            });
    
            await sharp(tmpFilePath)
                .resize(100, 100)
                .toFile(tmpAvatarPath);
    
            return bucket.upload(tmpAvatarPath, {
                destination: join(filePath, avatarFileName)
            });
        } else {
            return;
        }
      
    })