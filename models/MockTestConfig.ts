// models/MockTestConfig.ts
import mongoose, { Schema } from "mongoose";

const MockTestConfigSchema = new Schema({
  faculty: {
    type: String,
    unique: true,
    required: true,
  },

  durationMinutes: {
    type: Number,
    required: true,
  },

  totalQuestions: {
    type: Number,
    required: true,
  },

  /* ================= SUBJECT RULES ================= */
  subjectRules: [
    {
      subject: String,
      count: Number,

      compulsory: {
        type: Boolean,
        default: false,
      },

      group: {
        type: String, // e.g. "opt1", "opt2"
      },
    },
  ],

  /* ================= NEGATIVE MARKING CONFIG ================= */
  negativeMarking: {
    enabled: {
      type: Boolean,
      default: false, // default: no negative marking
    },
    perWrong: {
      type: Number,
      default: 0, // e.g. 0.25, 0.5, 1
    },
  },
});

export default mongoose.models.MockTestConfig ||
  mongoose.model("MockTestConfig", MockTestConfigSchema);