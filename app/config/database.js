
const databaseConfig = {
    // database: process.env.DB_NAME || "kienos_mysql",
    // host: process.env.DB_HOST || "localhost",
    // port: process.env.DB_PORT || "3306",
    // username: process.env.DB_USERNAME || "root",
    // password: process.env.DB_PASSWORD || "root",
    // dialect: process.env.DB_DIALECT || "mysql",
    database: process.env.DB_NAME || "pbl6",
    // host: process.env.DB_HOST || "pbl6-testdb.c7ukusg4cre2.ap-southeast-1.rds.amazonaws.com",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "cuong2102",
    dialect: process.env.DB_DIALECT || "postgres",
    // dialectOptions: {
    //   ssl: {
        
    //     rejectUnauthorized: false,
    //     decimalNumbers: true
    //   }
    // },
    operatorsAliases: 0,
    pool: {
        max: 200,            // Maximum number of connections in the pool
        min: 2,             // Minimum number of connections in the pool
        acquire: 30000,     // Maximum time (ms) to try getting a connection before throwing error
        idle: 10000,        // Time (ms) a connection can stay idle before being released
      },
    benchmark: true
};

module.exports = {
  local: {
    ...databaseConfig
  },
  development: {
    ...databaseConfig
  },
  test: {
    ...databaseConfig
  },
  production: {
    ...databaseConfig
  }
};