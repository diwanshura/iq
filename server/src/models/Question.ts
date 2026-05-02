import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  type: 'pattern' | 'logic' | 'spatial' | 'numerical' | 'memory' | 'abstract';
  difficulty: number;
  iq_section: '50-100' | '100-150' | '150+';
  source: 'dataset' | 'ai';
  options: string[];
  correct_answer: string;
  time_limit: number;
  explanation: string;
  tags: string[];
  datasetUrl?: string;
}

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pattern', 'logic', 'spatial', 'numerical', 'memory', 'abstract'],
      required: true
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    iq_section: {
      type: String,
      enum: ['50-100', '100-150', '150+'],
      required: true
    },
    source: {
      type: String,
      enum: ['dataset', 'ai'],
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr: string[]) {
          return arr.length >= 2;
        },
        message: 'Question must have at least 2 options'
      }
    },
    correct_answer: {
      type: String,
      required: true
    },
    time_limit: {
      type: Number,
      required: true,
      default: 40
    },
    explanation: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    datasetUrl: String
  },
  { timestamps: true }
);

// Index for faster queries
questionSchema.index({ iq_section: 1, difficulty: 1, type: 1 });

export default mongoose.model<IQuestion>('Question', questionSchema);
