DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude float,
    longitude float
<<<<<<< HEAD
);
=======
);
>>>>>>> be79d872c9b97d7c7563d2436a4d5bb600b0b195
