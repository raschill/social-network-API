import { Schema, model, Document } from 'mongoose';
import { iReaction } from './reaction';
import {reactionSchema} from './reaction.js';

interface iThought extends Document {
   thoughtText: string;
   createdAt: Date;
   username: string;
   reactions: iReaction[]; 
}

const thoughtSchema= new Schema<iThought>(
    {
        thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [
        reactionSchema
    ],
},

{
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
}
);

thoughtSchema
.virtual('reactionCount')
.get(function () {
    return this.reactions.length;
});

const Thought= model<iThought>('Thought', thoughtSchema);

export default Thought;