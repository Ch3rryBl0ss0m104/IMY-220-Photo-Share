// Populates the database with logical test data (2 users, 2 posts, 1 album, 1 user with a friend) 
// Run with: npm run seed
// Safe to re-run any time -it clears these collections first.

import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config({ quiet: true });

const placeholderImage =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#c3ecd0"/></svg>',
  ).toString('base64');

async function seed() {
  const db = await connectDB();
  const users = db.collection('users');
  const posts = db.collection('posts');
  const albums = db.collection('albums');
  const comments = db.collection('comments');

  console.log('Clearing existing collections...');
  await Promise.all([users.deleteMany({}), posts.deleteMany({}), albums.deleteMany({}), comments.deleteMany({})]);

  console.log('Creating users...');
  const now = new Date();
  const userDefs = [
    { name: 'Janke Rall', username: 'jankedoodles', email: 'test@test.com', password: 'test1234', bio: 'Second-year multimedia student. I doodle in colour and photograph everything else.', avatarColor: '#ffc7d6', links: ['instagram'] },
    { name: 'Mia Reyes', username: 'mia.snaps', email: 'mia@doodlr.test', password: 'password1', bio: 'Picnic-day chaser, film photography fan.', avatarColor: '#aee0f2', links: [] },
    { name: 'Theo Klein', username: 'theok', email: 'theo@doodlr.test', password: 'password1', bio: 'Sunsets and skateparks.', avatarColor: '#c3ecd0', links: [] },
    { name: 'Priya Desai', username: 'priyadoodles', email: 'priya@doodlr.test', password: 'password1', bio: 'Studio doodles, always with a coffee nearby.', avatarColor: '#fce095', links: [] },
    { name: 'Zanele Mokoena', username: 'zanelem', email: 'zanele@doodlr.test', password: 'password1', bio: 'Market colours and street photography.', avatarColor: '#d7c9f7', links: [] },
    { name: 'Ruan Visser', username: 'ruanv', email: 'ruan@doodlr.test', password: 'password1', bio: 'Roadtrip snaps and campfire stories.', avatarColor: '#ffc7d6', links: [] },
    { name: 'Kabelo Ndlovu', username: 'kabelon', email: 'kabelo@doodlr.test', password: 'password1', bio: 'Portraits and long exposures.', avatarColor: '#aee0f2', links: [] },
    { name: 'Olivia Reddy', username: 'oliviar', email: 'olivia@doodlr.test', password: 'password1', bio: 'Sunset chaser, weekend hiker.', avatarColor: '#c3ecd0', links: [] },
    { name: 'Dean Fischer', username: 'deanf', email: 'dean@doodlr.test', password: 'password1', bio: 'Black and white film only.', avatarColor: '#fce095', links: [] },
  ].map((u) => ({
    ...u,
    friends: [],
    friendRequestsIncoming: [],
    friendRequestsOutgoing: [],
    createdAt: now,
  }));

  const insertedUsers = await users.insertMany(userDefs);
  const ids = insertedUsers.insertedIds; // { 0: ObjectId, 1: ObjectId, ... }
  const [janke, mia, theo, priya, zanele, ruan, kabelo, olivia, dean] = Object.values(ids);

  console.log("Setting up friendships (test account needs at least 1)...");
  await users.updateOne({ _id: janke }, { $set: { friends: [mia, theo] } });
  await users.updateOne({ _id: mia }, { $set: { friends: [janke, theo] } });
  await users.updateOne({ _id: theo }, { $set: { friends: [janke, mia] } });
  // A pending request so the friend-request flow has something to demo.
  await users.updateOne({ _id: priya }, { $set: { friendRequestsOutgoing: [janke] } });
  await users.updateOne({ _id: janke }, { $set: { friendRequestsIncoming: [priya] } });

  console.log('Creating posts...');
  const postDefs = [
    { authorId: janke, caption: 'Beach day with the crew.', hashtags: ['#beachday', '#colourfulalbums'] },
    { authorId: mia, caption: 'Golden hour at the picnic spot, worth the ants.', hashtags: ['#picnicday', '#goldenhour'] },
    { authorId: mia, caption: 'Second round of picnic photos, the light kept getting better.', hashtags: ['#picnicday'] },
    { authorId: theo, caption: 'Good hair day, bad wifi day.', hashtags: ['#sunsets', '#weekend'] },
    { authorId: theo, caption: 'Skatepark at dusk, empty for once.', hashtags: ['#skatepark', '#sunsets'] },
    { authorId: priya, caption: 'Studio doodles from this afternoon.', hashtags: ['#doodles'] },
    { authorId: zanele, caption: 'Market colours downtown, could not stop shooting.', hashtags: ['#marketcolours'] },
    { authorId: ruan, caption: 'Roadtrip snaps somewhere past the second gas station.', hashtags: ['#roadtrip', '#doodles'] },
    { authorId: kabelo, caption: 'Portrait session with natural light only.', hashtags: ['#portraits'] },
    { authorId: olivia, caption: 'Hike ended right as the sun dropped.', hashtags: ['#sunsets', '#hiking'] },
    { authorId: dean, caption: 'Developed this roll myself, pretty happy with the contrast.', hashtags: ['#filmphotography'] },
  ].map((p) => ({ ...p, image: placeholderImage, reportCount: 0, reportReasons: [], createdAt: now }));

  const insertedPosts = await posts.insertMany(postDefs);
  const postIds = Object.values(insertedPosts.insertedIds);

  console.log('Adding a few comments...');
  await comments.insertMany([
    { postId: postIds[1], authorId: theo, text: 'This light is unreal.', createdAt: now },
    { postId: postIds[1], authorId: janke, text: 'Take me next time!', createdAt: now },
    { postId: postIds[3], authorId: priya, text: 'Iconic.', createdAt: now },
    { postId: postIds[0], authorId: mia, text: 'Missed this!', createdAt: now },
  ]);

  console.log('Creating albums...');
  await albums.insertMany([
    { ownerId: janke, name: 'Beach Trips', description: 'Every beach day worth remembering.', hashtags: ['#beachday'], postIds: [postIds[0]], createdAt: now },
    { ownerId: mia, name: 'Picnic Day', description: 'Snacks, sun, and slightly too many cloud photos.', hashtags: ['#picnicday', '#outdoors'], postIds: [postIds[1], postIds[2]], createdAt: now },
    { ownerId: theo, name: 'Golden Hours', description: 'Anything shot right before sunset.', hashtags: ['#sunsets'], postIds: [postIds[3], postIds[4]], createdAt: now },
    { ownerId: priya, name: 'Studio Doodles', description: 'A growing collection of sketchbook photos.', hashtags: ['#doodles'], postIds: [postIds[5]], createdAt: now },
    { ownerId: ruan, name: 'On The Road', description: 'Wherever the car ends up.', hashtags: ['#roadtrip'], postIds: [postIds[7]], createdAt: now },
  ]);

  console.log('\nSeed complete.');
  console.log(`Users: ${await users.countDocuments()}`);
  console.log(`Posts: ${await posts.countDocuments()}`);
  console.log(`Albums: ${await albums.countDocuments()}`);
  console.log(`Comments: ${await comments.countDocuments()}`);
  console.log('\nTest login -> email: test@test.com | password: test1234');

  await closeDB();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
