require('dotenv/config');

module.exports = {
  schema: ['./src/schemas', './src/core/enums.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
