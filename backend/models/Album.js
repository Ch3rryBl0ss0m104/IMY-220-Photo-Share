import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    hashtags: { type: [String], default: [] },
    postIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true },
);

export default mongoose.model('Album', albumSchema);
