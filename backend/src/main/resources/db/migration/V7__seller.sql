-- M5 Seller Workspace - smart.tobi.seller (CRDT)
CREATE TABLE deal_draft (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION,
    yjs_state_json TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
