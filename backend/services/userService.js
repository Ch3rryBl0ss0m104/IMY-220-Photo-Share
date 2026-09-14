import { getDb } from '../config/db.js';
import { toObjectId } from '../utils/objectId.js';

function usersCollection() {
  return getDb().collection('users');
}

// Never send the password field back to the client.
function sanitize(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

export async function findUserByEmailOrUsername(email, username) {
  return usersCollection().findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });
}

export async function findUserByEmail(email) {
  return usersCollection().findOne({ email: email.toLowerCase() });
}

export async function createUser({ name, username, email, password }) {
  const doc = {
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password, // stored unhashed 
    bio: '',
    avatarColor: '#ffc7d6',
    links: [],
    friends: [],
    friendRequestsIncoming: [],
    friendRequestsOutgoing: [],
    createdAt: new Date(),
  };
  const result = await usersCollection().insertOne(doc);
  return sanitize({ _id: result.insertedId, ...doc });
}

export async function getUserById(id) {
  const user = await usersCollection().findOne({ _id: toObjectId(id) });
  return sanitize(user);
}

export async function updateUser(id, updates) {
  const allowed = ['name', 'username', 'bio', 'links', 'avatarColor'];
  const setDoc = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) setDoc[key] = updates[key];
  }

  await usersCollection().updateOne({ _id: toObjectId(id) }, { $set: setDoc });
  return getUserById(id);
}

export async function deleteUser(id) {
  const objectId = toObjectId(id);
  await usersCollection().deleteOne({ _id: objectId });
  // Remove this user from everyone else's friend/request lists.
  await usersCollection().updateMany(
    {},
    {
      $pull: {
        friends: objectId,
        friendRequestsIncoming: objectId,
        friendRequestsOutgoing: objectId,
      },
    },
  );
}

export async function getFriends(id) {
  const user = await usersCollection().findOne({ _id: toObjectId(id) });
  if (!user || !user.friends?.length) return [];
  return usersCollection()
    .find({ _id: { $in: user.friends } })
    .project({ name: 1, username: 1, avatarColor: 1 })
    .toArray();
}

export async function sendFriendRequest(targetId, selfId) {
  const targetObjectId = toObjectId(targetId);
  const selfObjectId = toObjectId(selfId);
  await usersCollection().updateOne({ _id: targetObjectId }, { $addToSet: { friendRequestsIncoming: selfObjectId } });
  await usersCollection().updateOne({ _id: selfObjectId }, { $addToSet: { friendRequestsOutgoing: targetObjectId } });
}

export async function acceptFriendRequest(selfId, requesterId) {
  const selfObjectId = toObjectId(selfId);
  const requesterObjectId = toObjectId(requesterId);
  await usersCollection().updateOne(
    { _id: selfObjectId },
    { $pull: { friendRequestsIncoming: requesterObjectId }, $addToSet: { friends: requesterObjectId } },
  );
  await usersCollection().updateOne(
    { _id: requesterObjectId },
    { $pull: { friendRequestsOutgoing: selfObjectId }, $addToSet: { friends: selfObjectId } },
  );
}

export async function declineFriendRequest(selfId, requesterId) {
  const selfObjectId = toObjectId(selfId);
  const requesterObjectId = toObjectId(requesterId);
  await usersCollection().updateOne({ _id: selfObjectId }, { $pull: { friendRequestsIncoming: requesterObjectId } });
  await usersCollection().updateOne({ _id: requesterObjectId }, { $pull: { friendRequestsOutgoing: selfObjectId } });
}

export async function removeFriend(selfId, otherId) {
  const selfObjectId = toObjectId(selfId);
  const otherObjectId = toObjectId(otherId);
  await usersCollection().updateOne({ _id: selfObjectId }, { $pull: { friends: otherObjectId } });
  await usersCollection().updateOne({ _id: otherObjectId }, { $pull: { friends: selfObjectId } });
}
