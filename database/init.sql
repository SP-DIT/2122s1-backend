CREATE TABLE queue_tab (
    id SERIAL primary key,
    served BOOLEAN not null default false
);

CREATE TABLE error_tab (
    id SERIAL primary key,
    timestamp INT not null,
    status_code INT not null,
    payload TEXT not null
);
CREATE INDEX timestamp_key ON error_tab (timestamp);

