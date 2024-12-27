import {Schema, Document} from 'mongoose';

export interface iReaction extends Document {
    reactionBody: string;
    username: string;
    createdAt: Date;
}

export const reactionSchema= new Schema<iReaction>(
{    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },},
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

export default reactionSchema;