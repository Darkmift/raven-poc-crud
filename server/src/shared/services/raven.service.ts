import { GenericRecord } from '@/types';
import store from './raven-connection';
import { v4 as uuidv4 } from 'uuid';

export interface ISeacrOptions {
    key?: string;
    whereRegex?: string;
    limit?: number;
    page?: number;
}

const magic = Symbol();

export class DocumentFactory {
    private [magic] = 'unique';

    constructor(document: GenericRecord) {
        if (!document) {
            console.warn(document);
            return;
        }
        Object.keys(document).forEach(key => {
            if (typeof key === 'symbol') return;
            (this as Record<string, unknown>)[key] = document[key];
        });
    }
}

export async function createDocument({
    collection,
    document,
}: {
    collection: string;
    document: object;
}): Promise<object & { id: string }> {
    let session = store.openSession();
    const id = uuidv4();
    (document as any)._id = id;
    await session.store(document, `/${collection}/${id}`);
    await session.saveChanges();
    return (document as any).id;
}

export async function getDocument<T>({
    collection,
    id,
}: {
    collection: string;
    id: string;
}): Promise<T | null> {
    let session = store.openSession();
    let payload = session.query({ collection }).whereEquals('_id', id);
    return payload as T | null;
}

export async function getDocuments<T>(
    collection: string,
    { key, whereRegex, limit, page }: ISeacrOptions = {},
): Promise<T[]> {
    let session = store.openSession();
    let payload = session.query({ collection });

    if (whereRegex && key) {
        payload = payload.whereRegex(key, whereRegex);
    }

    if (page != null && limit != null) {
        // Check for null or undefined
        payload = payload.take(limit).skip(page * limit);
    }

    return (await payload.all()) as T[];
}

export async function bulkInsertDocumnets(payload: object[]) {
    let session = store.openSession();
    for (let item of payload) {
        await session.store(item);
    }
    await session.saveChanges();
}

export async function deleteDocument({
    id,
}: {
    collection: string;
    id: string;
}) {
    let session = store.openSession();
    await session.delete(id);
    await session.saveChanges();
}

export async function deleteCollection(collectionName: string): Promise<void> {
    const session = store.openSession();

    try {
        const query = session.query({ collection: collectionName });
        const documents = await query.all();

        // Delete each document
        for (const doc of documents) {
            await session.delete((doc as { id: string }).id);
        }

        await session.saveChanges();
    } catch (error) {
        console.error('Error deleting documents:', error);
        throw error;
    } finally {
        session.dispose();
    }
}
