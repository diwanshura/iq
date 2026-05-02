import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  ageRange: '10-18' | '19-45' | '46-60';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    ageRange: {
      type: String,
      enum: ['10-18', '19-45', '46-60'],
      required: true
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (this: any) {
  // Only hash if password field is modified or is new
  if (!this.isModified('passwordHash')) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', userSchema);
