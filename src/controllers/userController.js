import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { sendEmail } from '../utils/sendMail.js';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const resetPasswordUrl =
      `${process.env.FRONTEND_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;

    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFile);

    const templatePath = path.resolve(
      currentDir,
      '../templates/reset-password-email.html',
    );

    const templateHtml = await fs.readFile(templatePath, 'utf8');
    const template = Handlebars.compile(templateHtml);

    const html = template({
      name: user.username,
      resetPasswordUrl,
    });

    try {
      await sendEmail({
        to: user.email,
        subject: 'Скидання пароля',
        html,
      });
    } catch {
      return next(
        createHttpError(
          500,
          'Failed to send the email, please try again later.',
        ),
      );
    }

    return res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(
        createHttpError(401, 'Invalid or expired token'),
      );
    }

    if (!payload.sub || !payload.email) {
      return next(
        createHttpError(401, 'Invalid or expired token'),
      );
    }

    const user = await User.findOne({
      _id: payload.sub,
      email: payload.email,
    });

    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const userId = req.user._id ?? req.user.id;

    const result = await saveFileToCloudinary(
      req.file.buffer,
      userId,
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true },
    );

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return res.status(200).json({
      url: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};
