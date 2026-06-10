import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { createHttpError } from '../utils/httpError.js';
import { isSchemaMissingError } from '../data/demoContent.js';

export const subscribersRouter = Router();

// Simple email validation regex
function isValidEmail(email) {
  return typeof email === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
}

subscribersRouter.post('/', async (req, res, next) => {
  const { email } = req.body || {};
  if (!email || !isValidEmail(email)) {
    return next(createHttpError(400, 'Valid email is required.', 'VALIDATION_ERROR'));
  }

  try {
    const { data, error } = await supabase.from('subscribers').insert({ email: email.trim() }).single();
    if (error) {
      if (isSchemaMissingError(error)) {
        // If the table does not exist, just log and pretend success (demo mode)
        console.warn('Subscribers table missing, skipping actual DB insert.');
        return res.json({ ok: true, email: email.trim() });
      }
      throw error;
    }
    return res.status(201).json({ ok: true, subscriber: data });
  } catch (err) {
    return next(err);
  }
});
