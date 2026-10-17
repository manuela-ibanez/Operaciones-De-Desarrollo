// Valores del PostgreSQL de docker-compose para ejecutar los tests localmente.
// En GitHub Actions se conservan las variables definidas por el workflow.
process.env.DATABASE_URL ??=
  'postgresql://vete-admin:securepassword1234!@localhost:5433/vetedb';
process.env.DB_SYNC ??= 'true';
process.env.DB_SSL ??= 'false';
