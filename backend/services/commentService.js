import { getDb } from '../config/db.js';
import { toObjectId } from '../utils/objectId.js';

function commentsCollection() {
  return getDb().collection('comments');
}

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
    $addFields: {
      author: { _id: '$author._id', name: '$author.name', username: '$author.username', avatarColor: '$author.avatarColor' },
    },
  },
];

export async function getCommentsByPost(postId) {
  return commentsCollection()
    .aggregate([{ $match: { postId: toObjectId(postId) } }, ...AUTHOR_LOOKUP_STAGES, { $sort: { createdAt: 1 } }])
    .toArray();
}

export async function createComment({ postId, authorId, text }) {
  const doc = {
    postId: toObjectId(postId),
    authorId: toObjectId(authorId),
    text,
    createdAt: new Date(),
  };
  const result = await commentsCollection().insertOne(doc);
  const results = await commentsCollection()
    .aggregate([{ $match: { _id: result.insertedId } }, ...AUTHOR_LOOKUP_STAGES])
    .toArray();
  return results[0];
}

export async function getRawCommentById(id) {
  return commentsCollection().findOne({ _id: toObjectId(id) });
}

export async function updateComment(id, text) {
  await commentsCollection().updateOne({ _id: toObjectId(id) }, { $set: { text } });
  const results = await commentsCollection()
    .aggregate([{ $match: { _id: toObjectId(id) } }, ...AUTHOR_LOOKUP_STAGES])
    .toArray();
  return results[0];
}

export async function deleteComment(id) {
  await commentsCollection().deleteOne({ _id: toObjectId(id) });
}

export async function deleteCommentsByPost(postId) {
  await commentsCollection().deleteMany({ postId: toObjectId(postId) });
}