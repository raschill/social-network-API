import {Router} from 'express';
import {getUsers,
    getOneUser,
    createUser,
    updateOneUser,
    deleteUser,
    addFriend,
    deleteFriend
} from '../../controllers/userController.js';

const router= Router();

//GETs
router.route('/').get(getUsers);
router.route('/:userId').get(getOneUser);

// POSTs
router.route('/').post(createUser);
router.route('/:userId/friends/:friendId').post(addFriend);

// PUTs
router.route('/:userId').put(updateOneUser);

// DELETEs
router.route('/:userId').delete(deleteUser);
router.route('/:userId/friends/:friendId').delete(deleteFriend);

export default router;