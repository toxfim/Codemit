require('dotenv/config');

module.exports = {
  schema: './src/schemas',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
