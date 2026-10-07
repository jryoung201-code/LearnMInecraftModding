-- Learn Minecraft Modding Academy
-- Persistent Free Plan AI usage
-- 1 token is treated as 1 word for this project.

CREATE TABLE IF NOT EXISTS ai_free_usage (
  client_id TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  input_words INTEGER NOT NULL DEFAULT 0,
  output_words INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_free_usage_window_started_idx
  ON ai_free_usage (window_started_at);
