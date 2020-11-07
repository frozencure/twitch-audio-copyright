import 'dotenv/config';
import * as ip from 'ip';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  env: process.env.NODE_ENV,
  host: ip.address(),
  routePrefix: 'api',
  database: {
    type: 'postgres',
    username: process.env.POSTGRES_USER || 'twitch',
    password: process.env.POSTGRES_PASSWORD || '1q2w3e',
    name: process.env.POSTGRES_DB || 'twitch-fingerprint',
    ssl: false,
    port: parseInt(process.env.DB_PORT, 10) || 30003,
    host: process.env.DB_HOST || 'localhost'
  }
});
