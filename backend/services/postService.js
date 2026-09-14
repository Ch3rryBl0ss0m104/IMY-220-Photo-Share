import { getDb } from '../config/db.js';
import { toObjectId } from '../utils/objectId.js';

function postsCollection() {
  return getDb().collection('posts');
}

// Joins each post with a small subset of its author's public fields, so components can render post.author.name directly instead of looking users up themselves 
const AUTHOR_LOOKUP_STAGES = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author',
    },
  },
  { $unwind: '$author' },
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'postId',
      as: 'commentDocs',
    },
  },
  {
    $addFields: {
      author: { _id: '$author._id', name: '$author.name', username: '$author.username', avatarColor: '$author.avatarColor' },
      commentCount: { $size: '$commentDocs' },
    },
  },
  { $project: { commentDocs: 0 } },
];

export async function getAllPosts() {
  return postsCollection()
    .aggregate([...AUTHOR_LOOKUP_STAGES, { $sort: { createdAt: -1 } }])
    .toArray();
}

export async function getPostsByAuthor(authorId) {
  return postsCollection()
    .aggregate([{ $match: { authorId: toObjectId(authorId) } }, ...AUTHOR_LOOKUP_STAGES, { $sort: { createdAt: -1 } }])
    .toArray();
}

export async function getPostById(id) {
  const results = await postsCollection()
    .aggregate([{ $match: { _id: toObjectId(id) } }, ...AUTHOR_LOOKUP_STAGES])
    .toArray();
  return results[0] || null;
}

export async function createPost({ authorId, image, caption, hashtags }) {
  const doc = {
    authorId: toObjectId(authorId),
    image,
    caption,
    hashtags: Array.isArray(hashtags) ? hashtags : [],
    reportCount: 0,
    reportReasons: [],
    createdAt: new Date(),
  };
  const result = await postsCollection().insertOne(doc);
  return getPostById(result.insertedId.toString());
}

// Returns the raw (non-aggregated) post doc — used internally for ownership checks where the joined author info isn't needed.
export async function getRawPostById(id) {
  return postsCollection().findOne({ _id: toObjectId(id) });
}

export async function updatePost(id, { caption, hashtags }) {
  const setDoc = {};
  if (caption !== undefined) setDoc.caption = caption;
  if (hashtags !== undefined) setDoc.hashtags = hashtags;
  await postsCollection().updateOne({ _id: toObjectId(id) }, { $set: setDoc });
  return getPostById(id);
}

export async function deletePost(id) {
  await postsCollection().deleteOne({ _id: toObjectId(id) });
}

export async function reportPost(id, reason) {
  await postsCollection().updateOne(
    { _id: toObjectId(id) },
    { $inc: { reportCount: 1 }, $push: { reportReasons: reason } },
  );
  return getPostById(id);
}
