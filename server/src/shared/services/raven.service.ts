import { GenericRecord } from '@/types';
import store from './raven-connection';
import { v4 as uuidv4 } from 'uuid';
import { User, UsersIndex } from '@/api/user/user.service';
import { logger } from '@/utils/logger';

export interface ISearchOptions {
    key?: string;
    whereRegex?: string;
    limit?: number;
    page?: number;
}

const models = { User };
type CollectionModels = typeof User | typeof User;

interface RavenDocument {
    '@metadata': {
        '@id': string;
    };
    _id: string;
}

const magic = Symbol();

export class DocumentFactory {
    private [magic] = 'unique';
    [key: string]: any;

    constructor(document: GenericRecord) {
        if (document) {
            Object.keys(document).forEach(key => {
                if (typeof document[key] !== 'function') {
                    this[key] = document[key];
                }
            });
        }
        console.warn('Invalid document:', document);
    }
}

export async function createDocument(document: GenericRecord): Promise<string> {
    const session = store.openSession();
    const id = uuidv4();
    document._id = id;
    await session.store(document);
    await session.saveChanges();
    return document.id as string;
}

export async function getDocument<T>(id: string): Promise<T | null> {
    const session = store.openSession();
    const payload = await session.load(id);
    return payload as T | null;
}

export async function getDocuments<T>(
    collection: CollectionModels,
    { key, whereRegex, limit, page }: ISearchOptions = {},
): Promise<T[]> {
    const session = store.openSession();
    let query = session.query({
        indexName: 'Users/Name', // new UsersIndex().getIndexName()
    });

    // if (key && whereRegex) {
    //     query = query.whereRegex(key, whereRegex);
    // }

    // if (typeof page === 'number' && typeof limit === 'number') {
    //     return (await query
    //         .skip(page * limit)
    //         .take(limit)
    //         .all()) as T[];
    // }

    return (await query.all()) as T[];
}

export async function bulkInsertDocuments(documents: object[]) {
    const session = store.openSession();
    for (const document of documents) {
        await session.store(document);
    }
    await session.saveChanges();
}

export async function deleteDocument(id: string) {
    const session = store.openSession();
    await session.delete(id);
    await session.saveChanges();
}

export async function deleteCollection(
    collectionName: CollectionModels,
): Promise<void> {
    const session = store.openSession();
    try {
        const documents = await session.query(collectionName).all();
        for (const document of documents) {
            await session.delete(document);
        }
        await session.saveChanges();
    } catch (error) {
        console.error('Error deleting documents:', error);
        throw error;
    } finally {
        session.dispose();
    }
}
