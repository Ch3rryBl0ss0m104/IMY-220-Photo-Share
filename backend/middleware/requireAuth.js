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
