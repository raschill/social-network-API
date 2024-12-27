import mongoose from 'mongoose';
import User from '../models/user';
import Thought from '../models/thought';

const mongoURL= 'mongodb://127.0.0.1:27017/SocialNetworkAPI';

mongoose.connect(mongoURL)
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
        ])
    }
};