import {Router} from 'express';
import { getThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
} from '../../controllers/thoughtController.js';

const router= Router();

// GETs
router.get('/', getThoughts);
router.get('/:thoughtId', getOneThought);

// POSTs
router.post('/', createThought);
router.post('/thoughtId/reactions', createReaction);

// PUTs
router.put('/:thoughtId', updateThought);

// DELETEs
router.delete('/:thoughtId', deleteThought);
router.delete('/:thoughtId/reactions/:reactionId', deleteReaction);

export default router;
