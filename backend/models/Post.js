import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Stored as a base64 data URI so no separate file-upload service is needed yet - keeps the whole payload as plain JSON
    image: { type: String, required: true },
    caption: { type: String, required: true, trim: true },
    hashtags: { type: [String], default: [] },
    reportCount: { type: Number, default: 0 },
    reportReasons: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Post', postSchema);
