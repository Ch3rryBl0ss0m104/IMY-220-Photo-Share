import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    // passwords are intentionally left unhashed 
    password: { type: String, required: true },
    bio: { type: String, default: '', maxlength: 280 },
    avatarColor: { type: String, default: '#ffc7d6' },
    links: { type: [String], default: [] },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsIncoming: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequestsOutgoing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

// Never send the password back in any API response.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
