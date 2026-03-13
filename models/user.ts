import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // only for manual login
  image: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  isPremium: {
    type: Boolean,
    default: false
  },
  resetToken: String,
resetTokenExpiry: Date,

  provider: {
    type: String,
    enum: ["google", "credentials"]
  }
}, { timestamps: true });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
