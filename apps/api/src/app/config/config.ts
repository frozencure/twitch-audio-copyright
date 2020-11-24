import 'dotenv/config';
import * as ip from 'ip';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  env: process.env.NODE_ENV,
  host: ip.address(),
  routePrefix: 'api',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200/',
  database: {
    type: 'postgres',
    username: process.env.POSTGRES_USER || 'twitch',
    password: process.env.POSTGRES_PASSWORD || '1q2w3e',
    name: process.env.POSTGRES_DB || 'twitch-fingerprint',
    ssl: false,
    port: parseInt(process.env.DB_PORT, 10) || 30003,
    host: process.env.DB_HOST || 'localhost'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6380
  },
  acr_cloud: {
    fingerprint_script_path: `${__dirname}/assets/acr_cloud_tool/create_fingerprint.py`,
    host: process.env.ACR_CLOUD_HOST,
    access_key: process.env.ACR_ACCESS_KEY,
    secret_key: process.env.ACR_SECRET_KEY,
    endpoint: '/v1/identify',
    signature_version: '1',
    data_type: 'fingerprint'
  }
});
