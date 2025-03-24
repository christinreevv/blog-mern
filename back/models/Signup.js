import mongoose from 'mongoose';

const SignupSchema = new mongoose.Schema({
  email: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
});

export default mongoose.model('Signup', SignupSchema);
