-- ============================================================================
-- Init script: runs on PostgreSQL first boot
-- Sets up schemas, extensions, and roles required by Supabase services
-- ============================================================================

-- Create required schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant permissions
GRANT ALL ON SCHEMA auth TO postgres;
GRANT ALL ON SCHEMA storage TO postgres;
GRANT ALL ON SCHEMA extensions TO postgres;

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Make extensions available in public schema too
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
