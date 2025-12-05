# Supabase Migrations

This directory contains the database schema migrations for the Movie QLUB application.

## Migrations

- `20251204100000_create_voting_cycle_table.sql` - Creates the VotingCycle table for managing movie voting cycles

## How to apply migrations

To apply these migrations to your Supabase project, you can use the Supabase CLI:

```bash
supabase link --project-ref your-project-id
supabase db push
```

Or you can copy the SQL content and run it directly in your Supabase SQL editor.