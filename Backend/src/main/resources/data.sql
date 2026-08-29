-- Backfill existing users that were created before the provider column was added.
-- This runs once on startup; rows already having a provider value are unaffected.
UPDATE users SET provider = 'LOCAL' WHERE provider IS NULL;
