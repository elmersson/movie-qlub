-- Test query to check if voting cycles exist
SELECT * FROM "VotingCycle";

-- Test query to insert a sample voting cycle with valid dates
INSERT INTO "VotingCycle" (name, "suggestionStart", "votingStart", "votingEnd")
VALUES (
  'Test Cycle',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '2 days'
);