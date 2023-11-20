import { RAVEN_DATABASE, RAVEN_URL } from '@/config';
import fs from 'fs';
import path from 'path';
import DocumentStore, { IAuthOptions } from 'ravendb';

let certificateBuffer = fs.readFileSync(
    path.join(
        __dirname,
        '../../raven-certificates/free.aek-dev.client.certificate.with.password.pfx',
    ),
);

const authOptions: IAuthOptions = {
    certificate: certificateBuffer.toString('base64'),
    type: 'pfx',
    // password: 'my passphrase' // optional
};

let store = new DocumentStore(RAVEN_URL, RAVEN_DATABASE, authOptions);
store.initialize();

export default store;
