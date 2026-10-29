import { getDb } from '../config/db.js';
import { toObjectId } from '../utils/objectId.js';

// A small admin-managed collection of reasons someone can pick when reporting a post. Kept in the database (not hardcoded
// in the frontend) so an admin can add or remove reasons from the Admin page without touching code.

function reasonsCollection() {
  return getDb().collection('reportreasons');
}

export async function getAllReasons() {
  return reasonsCollection().find({}).sort({ createdAt: 1 }).toArray();
}

export async function addReason(label) {
  const doc = { label: label.trim(), createdAt: new Date() };
  const result = await reasonsCollection().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function deleteReason(id) {
  await reasonsCollection().deleteOne({ _id: toObjectId(id) });
}
