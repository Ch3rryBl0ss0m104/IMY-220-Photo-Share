import { getDb } from '../config/db.js';

// Simple case-insensitive substring search across the three searchable collections, plus hashtags.
// A query like "#doodles" or "doodles" both match posts/albums tagged #doodles.

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function searchAll(query) {
  const db = getDb();
  const term = query.trim().replace(/^#/, '');
  if (!term) return { users: [], posts: [], albums: [] };

  const pattern = new RegExp(escapeRegex(term), 'i');
  const hashtagPattern = new RegExp(`^#?${escapeRegex(term)}$`, 'i');

  const [users, posts, albums] = await Promise.all([
    db
      .collection('users')
      .find({ $or: [{ name: pattern }, { username: pattern }, { email: pattern }] })
      .project({ password: 0 })
      .limit(20)
      .toArray(),

    db
      .collection('posts')
      .aggregate([
        {
          $match: {
            reportCount: { $lt: 2 },
            $or: [{ caption: pattern }, { hashtags: hashtagPattern }],
          },
        },
        {
          $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' },
        },
        { $unwind: '$author' },
        {
          $addFields: {
            author: { _id: '$author._id', name: '$author.name', username: '$author.username', avatarColor: '$author.avatarColor' },
          },
        },
        { $limit: 20 },
      ])
      .toArray(),

    db
      .collection('albums')
      .find({ $or: [{ name: pattern }, { description: pattern }, { hashtags: hashtagPattern }] })
      .limit(20)
      .toArray(),
  ]);

  return { users, posts, albums };
}
