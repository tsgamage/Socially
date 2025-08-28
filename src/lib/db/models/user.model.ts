import mongoose from "mongoose";

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    clerkID: { type: String, unique: true, required: true, index: true },
    username: { type: String, unique: true, required: true, index: true }, // fast username lookups
    email: { type: String, unique: true, required: true, index: true }, // login
    name: { type: String },
    bio: { type: String, maxLength: 160 },
    status: { type: String },
    profilePic: { type: String },
    bannerPic: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

// Extra indexing
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

const User = mongoose.model("User", UserSchema);
export default User;