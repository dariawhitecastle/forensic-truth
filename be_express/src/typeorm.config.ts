// environment
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const {
  PGHOST = 'pg',
  PGUSER,
  PGPASSWORD,
  PGPORT = '5432',
  EXPRESS_TYPEORM_PGDATABASE: PGDATABASE
} = process.env;

// imports
import { ConnectionOptions } from 'typeorm';
import path from 'path';

const config: ConnectionOptions = {
  name: PGDATABASE,
  type: 'postgres',
  host: PGHOST,
  username: PGUSER,
  password: PGPASSWORD,
  port: parseInt(PGPORT),
  database: PGDATABASE,
  synchronize: false,
  logging: false,
  entities: [ path.join(__dirname, './entity/**/*') ],
  migrations: [ path.join(__dirname, './migration/**/*') ],
  // subscribers: [
  //    'src/subscriber/**/*.ts',
  // ],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration'
    // subscribersDir: 'src/subscriber',
  }
};

export = config;
