import store from './raven-connection';

export interface ISeacrOptions {
    key?: string;
    whereRegex?: string;
    limit?: number;
    page?: number;
}

export type GenericRecord = Record<string, unknown>;

const magic = Symbol();

export class DocumentFactory {
    private [magic] = 'unique';
    constructor(document: GenericRecord) {
        Object.keys(document).forEach(key => {
            (this as Record<string, unknown>)[key] = document[key];
        });
    }
}

export async function createDocument<T extends DocumentFactory>({
    collection,
    document,
}: {
    collection: string;
    document: T;
}) {
    let session = store.openSession();
    await session.store(document, `/${collection}`);
    await session.saveChanges();
}

export async function getDocument<T>(id: string): Promise<T | null> {
    let session = store.openSession();
    let payload = await session.load(id);
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

class User extends DocumentFactory {
    name: string;
    email: string;
    age: number;

    constructor(document: GenericRecord) {
        super(document);
        this.name = document.name as string;
        this.email = document.email as string;
        this.age = document.age as number;
    }
}

async function main() {
    const newUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        age: 30,
    };

    try {
        await createDocument({
            collection: 'users',
            document: new User(newUser),
        });
        console.log('User document created successfully');
    } catch (error) {
        console.error('Error creating user document:', error);
    }
}
