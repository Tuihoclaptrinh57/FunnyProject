-- M3 Social Feed - smart.tobi.feed
CREATE TABLE post (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    deal_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_post_author ON post(author_id);
-- pgvector extension for vector search (if available)
-- CREATE EXTENSION IF NOT EXISTS vector;
-- ALTER TABLE post ADD COLUMN embedding vector(1536);
