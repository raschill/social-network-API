import {User} from '../models/index';
import {Request, Response} from 'express';

export const getUsers= async (_req: Request, res: Response) => {
    try {
        const users= await User.find();
        res.json(users);
    }
    catch(err) {
        res.status(500).json(err);
    }
}

export const getOneUser= async (req: Request, res: Response) => {
    try {
        const user= await User.findById(req.params.userId).populate('thoughts').populate('friends');

        if (!user) {
            res.status(404).json({message: 'User ID not found.'});
            return;
        }
        res.json(user);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error retrieving user:", err);
            res.status(500).json({error: "Internal server error"});
        }
        else {
            res.status(500).json({error: "Unexpected error oops"});
        }
    }
}

export const createUser= async (req: Request, res: Response) => {
    try {
        const user= await User.create(req.body);
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const deleteUser= async (req: Request, res: Response) => {
    try {
        const user= await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            res.status(404).json({message: 'That user is not real lol.'});
        }
        res.json({message: 'User deleted.'})
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const updateOneUser= async (req: Request, res: Response) => {
    try {
        const user= await User.findOneAndUpdate(
            { name: req.params.name},
            req.body,
            {new: true, runValidators: true}
        );
        res.status(200).json(user);
        console.log('User updated.');
    }
    catch (err) {
        console.log('Error detected.');
        res.status(500).json({message: 'Error detected- oops!'})
    }
}

export const addFriend= async (req: Request, res: Response) => {
    try {
        const user= await User.findByIdAndUpdate(req.params.userId, {
            $addToSet: {friends: req.params.friendId}
        }, {new: true});

        if (!user) {
            res.status(404).json({ message: 'Who dat?'});
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

export const deleteFriend= async (req: Request, res: Response) => {
    try {
        const user= await User.findByIdAndUpdate(req.params.userId, {
            $pull: {friends: req.params.friendId}
        }, {new: true});
        
        if (!user) {
            res.status(404).json({message: 'New phone, who dis?'});
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
}