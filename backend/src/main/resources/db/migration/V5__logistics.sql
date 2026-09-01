-- M4 Logistics - smart.tobi.logistics
CREATE TABLE shipment (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    shipper_id BIGINT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE shipper_location (
    shipper_id BIGINT PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
