import { registro, login, validate } from '../controllers/authController.js';
import { verifyToken } from '../middleware/jwtValidate.js';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/validate', verifyToken, validate);

export default router;