-- Create the suggestion table
create table public.suggestion (
  id uuid not null default gen_random_uuid (),
  "movieTitle" text not null,
  "movieDetails" text null,
  "submittedAt" timestamp with time zone not null default now(),
  "cycleId" uuid not null,
  "submittedById" uuid not null,
  "imdbId" text null,
  year text null,
  runtime text null,
  genre text null,
  director text null,
  plot text null,
  "posterUrl" text null,
  "imdbRating" text null,
  constraint suggestion_pkey primary key (id),
  constraint suggestion_imdbId_key unique ("imdbId"),
  constraint suggestion_unique_per_user_cycle unique ("cycleId", "submittedById"),
  constraint suggestion_cycleId_fkey foreign KEY ("cycleId") references "VotingCycle" (id),
  constraint suggestion_submittedById_fkey foreign KEY ("submittedById") references profiles (id)
) TABLESPACE pg_default;

create index IF not exists suggestion_cycle_submitter_idx on public.suggestion using btree ("cycleId", "submittedById") TABLESPACE pg_default;