import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../index.js';
import User from '../models/userData.js';
import { dbOptions } from '../index.js';
import customEnv from 'custom-env';

customEnv.env();
chai.use(chaiHttp);

let requester;
const fakeUser = {
  email: 'brian_socks@gmailer.com',
  password: '193948dkflq',
  confirmPassword: '193948dkflq',
  firstName: 'Bowenski',
  lastName: 'Schweijerski',
};

describe('users', () => {
  before((done) => {
    requester = chai.request(app).keepOpen();
    mongoose.connect(process.env.MONGO_URI, dbOptions, (err) => {
      if (err) done(err);
      else done();
    });
  });
  afterEach((done) => {
    User.deleteMany({}, (err) => {
      if (err) done(err);
      else done();
    });
  });
  after(async () => {
    requester.close();
    await mongoose.connection.close();
  });

  /**
   * Test user signup
   */
  describe('POST users/signup', () => {
    it('ensures email, password, confirmPassword, firstName and lastName are all required for signup', (done) => {
      requester
        .post('/users/signup')
        .send({
          email: fakeUser.email,
          password: fakeUser.password,
          confirmPassword: fakeUser.confirmPassword,
          firstName: fakeUser.firstName,
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Missing some required field(s)');
          done();
        });
    });

    it('ensures password and confirmPassword fields are strictly equal', (done) => {
      requester
        .post('/users/signup')
        .send({ ...fakeUser, confirmPassword: 'dkfl29478392kfsldf' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal("Passwords don't match");
          done();
        });
    });

    it('signs up user with correct passwords and proceeds to verify their email', (done) => {
      requester
        .post('/users/signup')
        .send(fakeUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.have.string(
            'Email verification link sent',
          );
          done();
        });
    });
  });

  /**
   * Test confirmUser
   */
  describe('GET users/signup/emailconfirmation/newuser', () => {
    it('fails to confirm a new user if their email link credential has expired', (done) => {
      const signature = jwt.sign(
        {
          email: fakeUser.email,
          password: fakeUser.password,
          name: `${fakeUser.firstName} ${fakeUser.lastName}`,
        },
        process.env.JWT_SECRET,
        { expiresIn: '0.006s' },
      );

      requester
        .get('/users/signup/emailconfirmation/newuser')
        .query({ signature })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.have.string('Credentials link has expired');
          done();
        });
    })

    it('confirms a new user with the valid credentials in their email link', (done) => {
      const signature = jwt.sign(
        {
          email: fakeUser.email,
          password: fakeUser.password,
          name: `${fakeUser.firstName} ${fakeUser.lastName}`,
        },
        process.env.JWT_SECRET,
        { expiresIn: '5m' },
      );

      requester
        .get('/users/signup/emailconfirmation/newuser')
        .query({ signature })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.property('headers');
          expect(res.headers).to.be.an('object');
          expect(res.headers['content-type']).to.have.string('text/html');
          done();
        });
    });
  });

  /**
   * Test user signin
   */
  // describe('POST users/signin', () => {
  //   it('ensures ');
  // });
});
