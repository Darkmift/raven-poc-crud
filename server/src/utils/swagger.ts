import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '@/swaggerDoc.json';
export default {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(swaggerDoc),
};
