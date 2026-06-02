# Brukerveiledning

1. Installer verktøyene
- Installer Node.js.
- Installer PostgreSQL.


2. Installer Node-avhengighetene
- Åpne terminal i mappen files.
- Kjør:
  - npm install

3. Opprett PostgreSQL-database
- Start PostgreSQL-tjeneren.
- Opprett databasen.

Eller i psql:
```sql
CREATE DATABASE (legg navn);
```

4. Opprett tabellene
- Kjør SQL-filen create_tables.sql mot databasen.


5. Lag .env-filen
- Opprett filen files/.env hvis den ikke finnes.
- Legg inn følgende:
```text
DB_HOST=din db host
DB_USER=din db user
DB_PASSWORD=din passord
DB_NAME=din db navn
DB_PORT=din port
```

6. Start serveren
- I files-mappen, kjør:
  - npm start
