import { joiValidateMiddleware } from '@/api/common/middlwares/joi';
import { Router } from 'express';
import Joi from 'joi';
import { getUserById, getUsers } from './controller';

const router = Router();

const schemas = {
    params: Joi.object({
        limit: Joi.number().min(1),
        page: Joi.string().min(1),
        email: Joi.string().email().max(255),
        name: Joi.string().max(255),
        sort_direction: Joi.string().valid('asc', 'desc'),
    }),
};

router.get('/', joiValidateMiddleware(schemas.params, 'query'), getUsers);
router.get('/:id', getUserById);

export default router;
