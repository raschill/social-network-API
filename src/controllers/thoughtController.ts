import {Request, Response} from 'express';
import {User, Thought} from '../models/index.js';

export const getThoughts= async (_req: Request, res: Response): Promise<void> => {
    try {
        const thoughts= await Thought.find();
        res.json(thoughts);
    }
    catch(err) {
        res.status(500).json(err);
    }
};

export const getOneThought= async (req: Request, res: Response): Promise<void> => {
    try {
        const thought= await Thought.findById(req.params.thoughtId).populate('reactions');

        if (!thought) {
            res.status(404).json({message: 'No thoughts, head empty.'});
        }

        res.status(200).json(thought);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err);
            res.status(500).json({error: "Internal server error :(", details: err.message});
        }
        else {
            res.status(500).json({error: "Idk, unexpected error. Bummer."});
        }
    }
};

export const createThought= async (req: Request, res: Response): Promise<void> => {
    try {
        const newThought= await Thought.create({
            thoughtText: req.body.thoughtText,
            username: req.body.username,
        });
        const userUpdate= await User.findOneAndUpdate(
            {username: req.body.username},
            {$push: {thoughts: newThought._id} },
            {new: true}
        );

        if (!userUpdate) {
            res.status(404).json({ message: 'User not found.'});
            return;
        }

        res.status(201).json(newThought);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({error: 'Internal server error :((', details: err.message});
        }
        else {
            res.status(500).json({ error: 'Idk what happened, dude.'});
        }
    }
};

export const updateThought= async (req: Request, res: Response): Promise<void> => {
    try {
        const thought= await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!thought) {
            res.status(404).json({message: 'No thoughts, head empty... ya dumb b*tch.'});
            return;
        }
        res.json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
};

export const deleteThought= async (req: Request, res: Response): Promise<void> => {
    try {
        const thought= await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({message: 'No thoughts, head empty teehee!'});
            return;
        }
        res.json({message: 'This thought will never bother you again.'});
    }
    catch (err) {
        res.status(500).json(err);
    }
};

export const createReaction= async (req: Request, res: Response): Promise<void> => {
    try {
        const thought= await Thought.findById(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({message: 'No thoughts, head empty (but heart full!)'});
            return;
        }
        thought.reactions.push(req.body);
        await thought.save();
        res.json({message: 'Reaction added.', thought});
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({error: err.message});
        }
        else {
            res.status(500).json({error: "Unexpected error"});
        }
    }
};

export const deleteReaction= async (req: Request, res: Response): Promise<void> => {
    try {
        const {thoughtId, reactionId} = req.params;
        const updatedThought= await Thought.findByIdAndUpdate(thoughtId,
            {$pull: {reactions: {reactions: {_id: reactionId}}}},
            {new: true}
        );

        if (!updatedThought) {
            res.status(404).json({message: 'No updated thought.'});
            return;
        }

        res.json({message: 'This reaction will never bother you again.', updatedThought});
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({error: err.message});
        }
        else {
            res.status(500).json({error: "Unexpected error."});
        }
    }
};