import mongoose, { Schema, Document } from 'mongoose';

export interface ITestResult extends Document {
  userId: mongoose.Types.ObjectId;
  testId: mongoose.Types.ObjectId;
  iq_section: '50-100' | '100-150' | '150+';
  accuracy: number;
  estimatedIQ: number;
  totalTime: number;
  averageTimePerQuestion: number;
  speedVsAccuracy: {
    fast: number;
    medium: number;
    slow: number;
  };
  categoricalScores: {
    pattern: number;
    logic: number;
    spatial: number;
    numerical: number;
    memory: number;
    abstract: number;
  };
  cognitiveStrengths: string[];
  weaknesses: string[];
  recommendations: string[];
  completedAt: Date;
}

const testResultSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true
    },
    iq_section: {
      type: String,
      enum: ['50-100', '100-150', '150+'],
      required: true
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    estimatedIQ: {
      type: Number,
      required: true
    },
    totalTime: Number,
    averageTimePerQuestion: Number,
    speedVsAccuracy: {
      fast: Number,
      medium: Number,
      slow: Number
    },
    categoricalScores: {
      pattern: Number,
      logic: Number,
      spatial: Number,
      numerical: Number,
      memory: Number,
      abstract: Number
    },
    cognitiveStrengths: [String],
    weaknesses: [String],
    recommendations: [String],
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITestResult>('TestResult', testResultSchema);
