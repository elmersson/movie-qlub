-- Create the VotingCycle table
create table if not exists public."VotingCycle" (
  id uuid not null default gen_random_uuid (),
  name text not null,
  "suggestionStart" timestamp with time zone not null,
  "votingStart" timestamp with time zone not null,
  "votingEnd" timestamp with time zone not null,
  "winnerId" uuid null,
  constraint VotingCycle_pkey primary key (id),
  constraint VotingCycle_name_key unique (name),
  constraint VotingCycle_winnerId_key unique ("winnerId"),
  constraint VotingCycle_winnerId_fkey foreign key ("winnerId") references suggestion (id) on delete set null,
  constraint valid_cycle_timing check (
    (
      ("suggestionStart" < "votingStart")
      and ("votingStart" < "votingEnd")
    )
  )
) tablespace pg_default;

-- Create an index on votingEnd for faster queries
create index if not exists voting_cycle_end_idx on public."VotingCycle" using btree ("votingEnd") tablespace pg_default;