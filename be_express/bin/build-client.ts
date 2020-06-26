#!/usr/bin/env ts-node

// environment
require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env')
});

// imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from '../src/entity/User';
import * as F from '../packages/fp';

// connection
import config from '../src/typeorm.config';
import { entityToJson } from '../src/typeorm';

createConnection(config)
  .then(async (connection) => entityToJson(connection, User))
  .then(F.pretty)
  .then(F.onSuccess, F.onError);
