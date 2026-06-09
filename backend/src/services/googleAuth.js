import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';

function getGoogleProfileValue(profile, key) {
  return profile?.[key] || '';
}

function getGoogleEmail(profile) {
  return profile?.emails?.[0]?.value || '';
}

function getGoogleAvatar(profile) {
  return profile?.photos?.[0]?.value || null;
}

function getGoogleName(profile) {
  return (
    profile?.displayName ||
    [profile?.name?.givenName, profile?.name?.familyName].filter(Boolean).join(' ').trim() ||
    getGoogleEmail(profile)
  );
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

async function findUserByGoogleId(googleId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('google_id', googleId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function createUserFromGoogleProfile(profile) {
  const googleId = String(getGoogleProfileValue(profile, 'id'));
  const email = getGoogleEmail(profile);
  const name = getGoogleName(profile);
  const avatarUrl = getGoogleAvatar(profile);

  // First check if user already exists by email
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    // Update google_id, name, avatar if needed, but leave role alone (promoteAdminIfNeeded handles it)
    const { data, error } = await supabase
      .from('users')
      .update({
        google_id: googleId,
        name: name || existing.name,
        avatar_url: avatarUrl || existing.avatar_url,
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  // New user — assign admin role if email matches ADMIN_EMAIL
  const normalizedAdminEmail = normalizeEmail(env.adminEmail);
  const role = normalizedAdminEmail && normalizeEmail(email) === normalizedAdminEmail ? 'admin' : 'user';

  const { data, error } = await supabase
    .from('users')
    .insert({
      google_id: googleId,
      email,
      name,
      avatar_url: avatarUrl,
      role,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function promoteAdminIfNeeded(user) {
  const normalizedAdminEmail = normalizeEmail(env.adminEmail);

  if (!normalizedAdminEmail) {
    return user;
  }

  if (normalizeEmail(user.email) !== normalizedAdminEmail) {
    return user;
  }

  if (user.role === 'admin') {
    return user;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function syncGoogleUser(profile) {
  const googleId = String(getGoogleProfileValue(profile, 'id'));

  if (!googleId) {
    throw new Error('Google profile is missing the id field.');
  }

  let user = await findUserByGoogleId(googleId);

  if (!user) {
    user = await createUserFromGoogleProfile(profile);
  }

  user = await promoteAdminIfNeeded(user);

  return user;
}

export function createJwtForUser(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
    },
    env.jwtSecret,
    { expiresIn: '7d' },
  );
}
