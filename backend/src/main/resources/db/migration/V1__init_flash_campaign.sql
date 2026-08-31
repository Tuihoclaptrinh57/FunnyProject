-- US-201: Flash Campaign table - smart.tobi.flash
CREATE TABLE flash_campaign (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    stock_total INT NOT NULL CHECK (stock_total > 0),
    stock_remaining INT NOT NULL CHECK (stock_remaining >= 0),
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    max_per_user INT NOT NULL CHECK (max_per_user > 0),
    status VARCHAR(20) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_time_window CHECK (start_at < end_at),
    CONSTRAINT chk_stock CHECK (stock_remaining <= stock_total)
);

CREATE INDEX idx_flash_campaign_product_time ON flash_campaign(product_id, start_at, end_at);
CREATE INDEX idx_flash_campaign_status ON flash_campaign(status);

-- US-204: stock_hold + queue_ticket + orders (prepare for next US)
CREATE TABLE flash_stock_hold (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES flash_campaign(id),
    user_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_hold_expires ON flash_stock_hold(expires_at);

CREATE TABLE flash_queue_ticket (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES flash_campaign(id),
    user_id BIGINT NOT NULL,
    position INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE flash_orders (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL REFERENCES flash_campaign(id),
    user_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    idempotency_key VARCHAR(64) UNIQUE,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
