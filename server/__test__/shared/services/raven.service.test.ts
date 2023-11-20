import { User } from '@/api/user/user.service';
import {
    bulkInsertDocumnets,
    createDocument,
    deleteCollection,
    getDocument,
    getDocuments,
} from '@/shared/services/raven.service';

jest.setTimeout(10000);

describe('createDocument', () => {
    it('should create a document', async () => {
        const document = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            age: 30,
        });
        await createDocument({ collection: 'users', document });
        const createdDocuments = await getDocuments<User>('users', {
            whereRegex: 'users',
            key: 'id',
        });
        console.log(
            '🚀 ~ file: raven.service.test.ts:19 ~ it ~ createdDocuments:',
            createdDocuments,
        );
        expect(createdDocuments[0].name).toEqual(document.name);
    });
});

describe('getDocument', () => {
    it('should get a document', async () => {
        const testCreateDoc = await createDocument({
            collection: 'users',
            document: new User({
                name: 'John Doe',
                email: 'johndoe@example.com',
                age: 30,
            }),
        });

        const document = await getDocument<User>({
            collection: 'users',
            id: testCreateDoc.id,
        });
        expect(document?.id).toBe(testCreateDoc.id);
    });
});

describe('getDocuments', () => {
    it('should get documents', async () => {
        const documents = await getDocuments<User>('users', {
            page: 0,
            limit: 10,
        });
        expect(documents).toBeInstanceOf(Array);
        expect(documents.length).toBeLessThanOrEqual(10);
    });
});

describe('bulkInsertDocuments', () => {
    it('should insert multiple documents', async () => {
        const documents = [
            new User({
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                age: 25,
            }),
        ];
        await bulkInsertDocumnets(documents);
        const insertedDocuments = await getDocuments<User>('users', {
            limit: 2,
            page: 0,
        });

        const targetDocument = insertedDocuments.every(d => d.name.length);
        expect(targetDocument).toBe(true);
    });
});

describe('deleteDocuments', () => {
    it('should delete all documents', async () => {
        await deleteCollection('users');
        const documents = await getDocuments<User>('users');
        expect(documents).toEqual([]);
    });
});
