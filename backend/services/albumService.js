import { getDb } from '../config/db.js';
import { toObjectId } from '../utils/objectId.js';

function albumsCollection() {
  return getDb().collection('albums');
}

const POSTS_LOOKUP_STAGES = [
  {
    $lookup: {
      from: 'posts',
      localField: 'postIds',
      foreignField: '_id',
      as: 'posts',
    },
  },
];

// Admin-only - every album across every user, newest first.
export async function getAllAlbums() {
  return albumsCollection()
    .aggregate([{ $sort: { createdAt: -1 } }, ...POSTS_LOOKUP_STAGES])
    .toArray();
}

export async function getAlbumsByOwner(ownerId) {
  return albumsCollection()
    .find({ ownerId: toObjectId(ownerId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getAlbumById(id) {
  const results = await albumsCollection()
    .aggregate([{ $match: { _id: toObjectId(id) } }, ...POSTS_LOOKUP_STAGES])
    .toArray();
  return results[0] || null;
}

export async function getRawAlbumById(id) {
  return albumsCollection().findOne({ _id: toObjectId(id) });
}

export async function createAlbum({ ownerId, name, description, hashtags }) {
  const doc = {
    ownerId: toObjectId(ownerId),
    name,
    description: description || '',
    hashtags: Array.isArray(hashtags) ? hashtags : [],
    postIds: [],
    createdAt: new Date(),
  };
  const result = await albumsCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function updateAlbum(id, { name, description, hashtags }) {
  const setDoc = {};
  if (name !== undefined) setDoc.name = name;
  if (description !== undefined) setDoc.description = description;
  if (hashtags !== undefined) setDoc.hashtags = hashtags;
  await albumsCollection().updateOne({ _id: toObjectId(id) }, { $set: setDoc });
  return getRawAlbumById(id);
}

export async function deleteAlbum(id) {
  await albumsCollection().deleteOne({ _id: toObjectId(id) });
}

export async function addPostToAlbum(albumId, postId) {
  await albumsCollection().updateOne({ _id: toObjectId(albumId) }, { $addToSet: { postIds: toObjectId(postId) } });
  return getAlbumById(albumId);
}

export async function removePostFromAlbum(albumId, postId) {
  await albumsCollection().updateOne({ _id: toObjectId(albumId) }, { $pull: { postIds: toObjectId(postId) } });
  return getAlbumById(albumId);
}

// Used when a post is deleted: pulls it out of every album, then deletes any album that's left with zero posts as a result.
export async function removePostFromAllAlbums(postId) {
  const postObjectId = toObjectId(postId);
  const affected = await albumsCollection().find({ postIds: postObjectId }).toArray();

  await albumsCollection().updateMany({ postIds: postObjectId }, { $pull: { postIds: postObjectId } });

  const emptiedAlbumIds = affected.filter((album) => album.postIds.length === 1).map((album) => album._id);
  if (emptiedAlbumIds.length > 0) {
    await albumsCollection().deleteMany({ _id: { $in: emptiedAlbumIds } });
  }
}
