import {
    DocumentFactory,
    getDocument,
    getDocuments,
} from '@/shared/services/raven.service';
import { GenericRecord } from '@/types';
import { IUser } from '@/types/User';

export const getById = async ({
    collection,
    id,
}: {
    collection: string;
    id: string;
}): Promise<IUser | null> => {
    return getDocument<IUser>({ collection, id });
};

export const getAll = async (): Promise<IUser[] | null> => {
    return getDocuments('users');
};

export class User extends DocumentFactory {
    name: string;
    email: string;
    age: number;
    id?: string;

    constructor(document: GenericRecord) {
        super(document);
    }
}
