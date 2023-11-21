import { User } from '@/api/user/user.service';
import {
    bulkInsertDocuments,
    createDocument,
    deleteCollection,
    getDocument,
    getDocuments,
} from '@/shared/services/raven.service';

jest.setTimeout(10000);

const TEST_COLLECTION = 'testUsers';
const mockUser = new User({
    name: 'John Doe',
    email: 'johndoe@example.com',
    age: 30,
});

describe('createDocument', () => {
    it('should create a document', async () => {
        const createdDocId = await createDocument(mockUser);
        const createdDocument = await getDocument<User>(createdDocId);
        expect(createdDocument?.name).toEqual(mockUser.name);
    });
});

describe('getDocument', () => {
    it('should get a document', async () => {
        const createdDocId = await createDocument(mockUser);

        const fetchedDocument = await getDocument<User>(createdDocId);
        expect(fetchedDocument?.id).toBe(createdDocId);
    });
});

describe('getDocuments', () => {
    it('should get documents', async () => {
        const documents = await getDocuments<User>(User, {
            whereRegex: TEST_COLLECTION,
            key: '_id',
        });
        expect(documents).toBeInstanceOf(Array);

        // should have documents in the array
        expect(documents.length).toBeGreaterThan(0);
        expect(documents.length).toBeLessThanOrEqual(10);
    });
});

describe('bulkInsertDocuments', () => {
    it('should insert multiple documents', async () => {
        const documents = [mockUser, mockUser, mockUser];
        await bulkInsertDocuments(documents);
        const insertedDocuments = await getDocuments<User>(User);

        const targetDocument = insertedDocuments.every(d => d.name.length);
        expect(targetDocument).toBe(true);
    });
});

describe('deleteDocuments', () => {
    it('should delete all documents', async () => {
        await deleteCollection(User);
        const documents = await getDocuments<User>(User, {
            limit: Infinity,
            page: 0,
        });
        expect(documents).toEqual([]);
    });
});
