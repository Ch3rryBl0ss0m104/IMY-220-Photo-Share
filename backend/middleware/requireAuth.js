import * as userService from '../services/userService.js';

// Reads the logged-in user's id from the session cookie. Any route that needs "must be logged in" or "must be the owner" protection uses this.

export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'You must be signed in to do that.' });
  }
  next();
}

// Stricter check: the logged-in user must match the :id / resource owner being acted on. Call this AFTER requireAuth, once the resource has been fetched, comparing
// resource.authorId / ownerId against req.session.userId.

export function isOwner(resourceOwnerId, req) {
  return req.session?.userId && resourceOwnerId.toString() === req.session.userId.toString();
}

// Admin-only routes: run AFTER requireAuth. Looks the user back up (isAdmin is never trusted from the client) and blocks anyone who isn't flagged as an admin.
export async function requireAdmin(req, res, next) {
  try {
    const user = await userService.getUserById(req.session.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access only.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Could not verify admin access.' });
  }
}
