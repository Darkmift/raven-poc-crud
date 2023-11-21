import {
    DocumentFactory,
    getDocument,
    getDocuments,
} from '@/shared/services/raven.service';
import { GenericRecord } from '@/types';
import { IUser } from '@/types/User';
import { AbstractJavaScriptIndexCreationTask } from 'ravendb';

export const getById = async ({
    id,
}: {
    id: string;
}): Promise<IUser | null> => {
    return getDocument<IUser>(id);
};

export const getAll = async (): Promise<IUser[] | null> => {
    return getDocuments(User, { key: 'name', limit: 10, page: 0 });
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

// Static index definitionus
export class UsersIndex extends AbstractJavaScriptIndexCreationTask<User> {
    constructor() {
        super();
        this.map(User, doc => {
            return {
                name: doc.name
            }
        });
        
        // Enable the suggestion feature on index-field 'name'
        this.suggestion("name"); 
    }
}
