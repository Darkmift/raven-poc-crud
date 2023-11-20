import { getDocument, getDocuments } from '@/shared/services/raven.service';
import { User } from '@/types/User';

export const getById = async (id: string): Promise<User | null> => {
    return getDocument<User>(id);
};

export const getAll = async (): Promise<User[] | null> => {
    return getDocuments('users');
};
