import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    question:{ 
      type: String, 
      required: true 
    },
    options: { 
      type: [String], 
      required: true 
    },
    correctAnswer: { 
      type: Number, 
      required: true 
    },

    faculty: {
       type: String, 
       required: true 
      }, // BIT, IOE

    subject: 
    {
       type: String,
       required: true
       },
                              // DBMS, Math
    difficulty: 
    { 
      type: String 
    },              // easy, medium, hard

    explanation: 
    { 
    type: String
   }
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
