DROP TABLE IF EXISTS favjokes;
CREATE TABLE IF NOT EXISTS favjokes(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    setup VARCHAR(255),
    punchline TEXT

)
    