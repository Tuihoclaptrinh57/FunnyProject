-- M2 Live - smart.tobi.live
CREATE TABLE live_session (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    seller_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ
);
CREATE TABLE live_pinned_deal (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES live_session(id),
    deal_id BIGINT NOT NULL,
    pinned_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_pinned_session ON live_pinned_deal(session_id);
