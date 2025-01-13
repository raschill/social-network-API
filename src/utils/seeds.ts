import mongoose from 'mongoose';
import User from '../models/user.js';
import Thought from '../models/thought.js';

const mongoURI= 'mongodb://127.0.0.1:27017/SocialNetworkAPI';

mongoose.connect(mongoURI)
.then(() => console.log('mongoDB has been connected'))
.catch(err => console.log(err));

async function seedDB() {
    try {
        await User.deleteMany({});
        await Thought.deleteMany({});

        const users= await User.create([
            {username: "Alice", email: "alice@wonderland.com"},
            {username: "Bob", email: "bob@thebuilder.com"},
            {username: "Carl", email: "carl@caaaarl.com"}
        ]);

        const thoughtData= [
            {thoughtText: "If I had a nickel...", username: "Carl", reactions: [{reactionBody: "lol right??", username: "Bob"}] },
            {thoughtText: "Really wishing I hadn't chased that rabbit right about now.", username: "Alice", reactions: [{reactionBody: "I feel that, girlie-pop", username: "Carl"}]},
            {thoughtText: "They always ask Can we fix it? and never Should we fix it? smh", username: "Bob", reactions: [{reactionBody: "At least they don't put you on trial", username: "Alice"}]},
        ];

        const thoughts= await Promise.all(thoughtData.map(async (data) => {
            const newThought= new Thought({
                thoughtText: data.thoughtText,
                username: data.username,
                reactions: data.reactions
            });
            await newThought.save();
            await User.findOneAndUpdate(
                {username: data.username},
                {$push: {thoughts: newThought._id}}
            );
        }));

        console.log('Added thoughts and reactions', thoughts);

        for (let i=0; i< users.length; i++) {
            const randomIndex= Math.floor(Math.random()* users.length);

            if (users[i]._id !== users[randomIndex]._id) {
                await User.findByIdAndUpdate(users[i]._id, {$addToSet: {friends: users[randomIndex]._id} });
                await User.findByIdAndUpdate(users[randomIndex]._id, {$addToSet: {friends: users[i]._id} });
            }
        }

        console.log('Friendship is Magic!');

        mongoose.disconnect();
        console.log('DB seeded/connection closed.');
    }
    catch (err) {
        console.error('Error while seeding DB:', err);
        mongoose.disconnect();
    }
};

seedDB();