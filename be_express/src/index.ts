// environment
require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env'),
});

// imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import { PostRequestHandler, RequestHandler } from './express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
// import expressJwt from 'express-jwt';
import crypto from 'crypto';

import { User } from './entity/User';
import { UserDomainRole } from './entity/UserDomainRole';
import { Question } from './entity/Question';
import { Section } from './entity/Section';

// connection
import config from './typeorm.config';
import { Submission } from './entity/Submission';

createConnection(config)
  .then(async (connection) => {
    // app
    const { EXPRESS_TYPEORM_PORT: PORT = 1337 } = process.env;
    const baseUrl = `http://localhost:${PORT}`;
    const accessTokenSecret = crypto.randomBytes(64).toString('hex');

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan('dev'));

    // Login
    app.post('/examiner/login', async (req, res) => {
      const { emailAddress, password } = req.body;
      console.log(emailAddress, password);

      try {
        const user = await userRepository.findOne({ emailAddress });
        console.log('******* NEWUSER', user);
        if (user) {
          const accessToken = jwt.sign(
            { username: emailAddress },
            accessTokenSecret,
            { expiresIn: 129600 }
          );
          res.json({
            accessToken,
          });
        } else {
          res.status(401).json({
            sucess: false,
            token: null,
            err: 'Username or password is incorrect',
          });
        }
      } catch (err) {
        throw err;
      }
    });

    // Section
    const sectionRepository = connection.getRepository(Section);

    app.get('/api/question', async (req: Request, res: Response) => {
      const sections = await sectionRepository.find({
        relations: ['question'],
      });
      return res.send(sections);
    });

    // User
    const userRepository = connection.getRepository(User);
    app.post(
      '/api/create-user',
      PostRequestHandler(async (body) => {
        const user = new User();
        Object.assign(user, body);
        await userRepository.save(user);
        return user;
      })
    );

    // Submission
    const submissionsRepository = connection.getRepository(Submission);
    app.post(
      '/api/submissions',
      RequestHandler(async (body: any) => {
        const submission = Object.assign(new Submission(), body);
        await submissionsRepository.save(submission);
        return submission;
      })
    );

    // /submissions?caseId=xxx,lastName=yyy
    app.get(
      '/api/submissions',
      RequestHandler((query) => submissionsRepository.find(query), ['query'])
    );

    // app.post(
    //   '/find-user-by-id',
    //   PostRequestHandler(async ({ id }) => userRepository.findOne(id))
    // );
    // app.post(
    //   '/delete-user-by-id',
    //   PostRequestHandler(async ({ id }) => userRepository.delete(id))
    // );

    // UserDomainRole
    // const userDomainRolesRepository = connection.getRepository(UserDomainRole);
    // app.post(
    //   '/create-user-domain-role',
    //   PostRequestHandler(async (body) => {
    //     const userDomainRole = new UserDomainRole();
    //     Object.assign(userDomainRole, body);
    //     await userDomainRolesRepository.save(userDomainRole);
    //     return userDomainRole;
    //   })
    // );

    app.listen(PORT, () => console.log('app listening on', PORT));
  })
  .catch((error) => console.log(error));
