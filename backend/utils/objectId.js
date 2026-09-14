import { ObjectId } from 'mongodb';

// Throws a clear, catchable error instead of letting an invalid id string the native driver with a cryptic BSON error.

export function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid id.');
    error.status = 400;
    throw error;
  }
  return new ObjectId(id);
}