// environment
require('dotenv').config({
  path: require('path').join(__dirname, '../../../.env'),
});

const logReturn = (x) => {
  console.log(x);
  return x;
};

// imports
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import { PostRequestHandler, RequestHandler } from './express';
import { Request, Response } from 'express';
import * as R from 'ramda'
import * as bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from './entity/User';
import { Section } from './entity/Section';
import { Note } from './entity/Note'

// connection
import config from './typeorm.config';
import { Submission } from './entity/Submission';

createConnection(config)
  .then(async (connection) => {
    // app
    const { EXPRESS_TYPEORM_PORT: PORT = 1337 } = process.env;
    const baseUrl = `http://localhost:${PORT}`;

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan('dev'));

    // Login
    app.post('/api/examiner/login', async (req, res) => {
      const { emailAddress, password } = req.body;

      try {
        const user = await userRepository.findOne({ emailAddress });
        if (user) {
          const validated = await bcrypt.compare(password, user.secret);
          if (validated) {
            const accessToken = jwt.sign(
              { username: emailAddress },
              process.env.TOKEN_SECRET,
              { expiresIn: 129600 }
            );
            res.json({
              accessToken,
            });
          }
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
      PostRequestHandler(async ({ password, ...userInfo }) => {
        const user = new User();
        const salt = await bcrypt.genSalt(10);
        user.secret = await bcrypt.hash(password, salt);
        Object.assign(user, userInfo);
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
        submission.answer = body.answer;
        await submissionsRepository.save(submission);
        return submission;
      })
    );

    // /all-submissions
    app.get(
      '/api/all-submissions',
      RequestHandler(async () => {
        const allSubmissions = await submissionsRepository.find();
        return allSubmissions.map((submission) => {
          const { answer } = submission;
          const filteredAnswer = answer.filter(
            (singleAnswer) =>
              singleAnswer.question.id === 1 ||
              singleAnswer.question.id === 3 ||
              singleAnswer.question.id === 9
          );
          return {
            ...submission,
            answer: filteredAnswer,
          };
        });
        //
      })
    );

    // /submissions?caseId=xxx,lastName=yyy
    app.get(
      '/api/submissions',
      RequestHandler((query) => submissionsRepository.find(query), ['query'])
    );
     
    // /notes
    const noteRepository = connection.getRepository(Note);
    app.post('/api/note',
      RequestHandler(async (body: any) => {
        await R.map(noteRepository.save.bind(noteRepository))(body)
        const savedNotes = await noteRepository.find({ where: { submissionId: body[0].submissionId } });
        return savedNotes
      })
    )


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
