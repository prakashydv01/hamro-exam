import mongoose, { Schema } from "mongoose";

const MockTestAttemptSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    faculty: {
      type: String,
      required: true,
    },

    questions: [
      {
        questionId: Schema.Types.ObjectId,
        correctAnswer: Number,
      },
    ],

    answers: {
      type: Map,
      of: Number,
    },

    score: Number,
    correct: Number,
    wrong: Number,

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },

    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.MockTestAttempt ||
  mongoose.model("MockTestAttempt", MockTestAttemptSchema);
