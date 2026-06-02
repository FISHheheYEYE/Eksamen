-- create_tables.sql
-- Kjør denne filen mot PostgreSQL for å opprette de tabellene som trengs for prosjektet.

-- Tabell for produkter som admin-siden kan legge inn.
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- Eksempel-tabell for brukere. Serveren har en /users-rute som leser fra denne tabellen.
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Eksempeldata for testing (kan fjernes etter at tabellene er opprettet).
INSERT INTO products (category, name, description, price, image)
VALUES
  ('Musiker', 'Live Musikk - Trio', 'En energisk musikktrio som spiller pop, jazz og festlåter.', 4500.00, 'https://via.placeholder.com/600x400?text=Musiker'),
  ('Bordkort', 'Personlige bordkort', 'Elegante bordkort med navn og bordnummer.', 85.00, 'https://via.placeholder.com/600x400?text=Bordkort'),
  ('Blomster', 'Bukett med sesongblomster', 'Fargerik bukett med sesongens fineste blomster og grønt.', 650.00, 'https://via.placeholder.com/600x400?text=Blomster');



