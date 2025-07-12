import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "skills",
  password: "90803",
  port: 5432,
});

export default pool;
