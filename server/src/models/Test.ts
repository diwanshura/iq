import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  userId: mongoose.Types.ObjectId;
  iq_section: '50-100' | '100-150' | '150+';
  startedAt: Date;
  completedAt?: Date;
  totalTime?: number;
  questions: mongoose.Types.ObjectId[];
  currentQuestionIndex: number;
  isActive: boolean;
  responses: Array<{
    questionId: mongoose.Types.ObjectId;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    timestamp: Date;
  }>;
}

const testSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    iq_section: {
      type: String,
      enum: ['50-100', '100-150', '150+'],
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    totalTime: Number,
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }
    ],
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    responses: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },
        selectedAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<ITest>('Test', testSchema);
