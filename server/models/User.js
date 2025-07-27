import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  bio: {
    type: String,
    default: '',
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  socialLinks: {
    facebook: {
      type: String,
      default: '',
      match: [
        /^(https?:\/\/)?(www\.)?facebook\.com\/.+/i,
        'Please enter a valid Facebook URL'
      ]
    },
    instagram: {
      type: String,
      default: '',
      match: [
        /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
        'Please enter a valid Instagram URL'
      ]
    },
    linkedin: {
      type: String,
      default: '',
      match: [
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i,
        'Please enter a valid LinkedIn URL'
      ]
    },
    twitter: {
      type: String,
      default: '',
      match: [
        /^(https?:\/\/)?(www\.)?twitter\.com\/.+/i,
        'Please enter a valid Twitter URL'
      ]
    },
    website: {
      type: String,
      default: '',
      match: [
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i,
        'Please enter a valid website URL'
      ]
    }
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  profilePicture: {
    type: String,
    default: ''
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Enable virtuals in both JSON and object outputs
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// ✅ Virtuals
userSchema.virtual('followersCount').get(function () {
  return this.followers?.length || 0;
});

userSchema.virtual('followingCount').get(function () {
  return this.following?.length || 0;
});

// ✅ Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Set passwordChangedAt timestamp
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // subtract 1s to ensure it's before JWT iat
  next();
});

// ✅ Compare raw password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken;
};

// ✅ Check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
