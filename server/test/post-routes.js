import chaiHttp from 'chai-http';
import server from '../index.js';
import { dbOptions } from '../index.js';
import path from 'path';
import fs from 'fs';
import chai, { expect } from 'chai';
import jwt from 'jsonwebtoken';
import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';
import customEnv from 'custom-env';

customEnv.env();

chai.use(chaiHttp);

const cwd = process.cwd();
const testUser = {
  email: 'john_doe@john-doe.org',
  id: String(Date.now()) + 'AJ29GF$.492390099KLGNNM',
};
const singlePost = {
  title: 'Lorem Ipsum',
  name: 'Lorem',
  message: 'Lorem ipsum dolor met sit acques bromet quinine ethane',
  creator: testUser.id,
  tags: ['test', 'lorem'],
  selectedFile: fs.readFileSync(path.join(cwd, 'test/test_image.jpg'), {
    encoding: 'utf8',
  }),
};
const manyPosts = [
  {
    title: 'Moon and Sun',
    name: 'Folklore',
    message: 'Moon gives light by night, while sun, by the day',
    tags: ['folklore', 'celestials'],
    creator: testUser.id,
  },
  {
    title: 'Mongo and DB',
    name: 'DBMongo',
    message: 'Mongo should save the mango data',
    tags: ['mongo', 'mango', 'db'],
    creator: testUser.id,
  },
  {
    title: 'Pros and Cons',
    name: 'Factual',
    message: 'You should never forget that everything has its pros and cons.',
    creator: testUser.id,
    tags: ['facts', 'pros-cons'],
  },
];

let testUserToken;
let requester;

describe('/posts', () => {
  before((done) => {
    requester = chai.request(server).keepOpen();
    testUserToken = jwt.sign(testUser, 'test', { expiresIn: '3h' });
    mongoose.connect(process.env.MONGO_URI, dbOptions, (err) => {
      if (err) return done(err);
      done();
    });
  });
  afterEach((done) => {
    PostMessage.deleteMany({}, (err) => {
      expect(err).to.be.null;
      done();
    });
  });
  after(async () => {
    requester.close();
    await mongoose.connection.close();
  });

  /**
   * Test createPost route
   */
  describe('POST /posts/', () => {
    it('should not create a post without the title field', (done) => {
      const post = {
        name: 'Lorem',
        message: 'Lorem ipsum dolor met sit acques bromet quinine ethane',
        tags: ['test', 'lorem'],
      };
      requester
        .post('/posts/')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(post)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should not create a post without the message field', (done) => {
      const post = {
        title: 'Lorem Ipsum',
        name: 'Lorem',
        tags: ['test', 'lorem'],
      };
      requester
        .post('/posts/')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(post)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should not create a post without the name field', (done) => {
      const post = {
        title: 'Lorem Ipsum',
        message: 'Lorem ipsum dolor met sit acques bromet quinine ethane',
        tags: ['test', 'lorem'],
      };
      requester
        .post('/posts/')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(post)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('requires valid user authentication to create post', (done) => {
      requester
        .post('/posts/')
        .send(singlePost)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Authentication Required');
          done();
        });
    });

    it('allows a verified user to create a post with all required fields', (done) => {
      requester
        .post('/posts/')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(singlePost)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('title');
          expect(res.body.title).to.be.a('string');
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.be.a('string');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body).to.have.property('tags');
          expect(res.body.tags).to.be.an('array');
          expect(res.body).to.have.property('selectedFile');
          expect(res.body.selectedFile).to.be.a('string');
          done();
        });
    });
  });

  /**
   * Test getPost route
   */
  describe('GET /:id', () => {
    const post = {
      title: 'Lorem Ipsum',
      name: 'Lorem',
      message: 'Lorem ipsum dolor met sit acques bromet quinine ethane',
      tags: ['test', 'lorem'],
      creator: testUser.id,
      selectedFile: fs.readFileSync(path.join(cwd, 'test/test_image.jpg'), {
        encoding: 'utf8',
      }),
    };

    it('requires valid user authentication to view a post details page', (done) => {
      const postDoc = new PostMessage(post);
      postDoc.save((err, doc) => {
        expect(err).to.be.null;
        requester.get(`/posts/${doc._id}`).end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Authentication Required');
          done();
        });
      });
    });

    it('allows a verified user to view a post details page', (done) => {
      const postDoc = new PostMessage(post);
      postDoc.save((err, doc) => {
        expect(err).to.be.null;
        requester
          .get(`/posts/${doc._id}`)
          .set('Authorization', `Bearer ${testUserToken}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('title');
            expect(res.body.title).to.be.a('string');
            expect(res.body).to.have.property('name');
            expect(res.body.name).to.be.a('string');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body).to.have.property('selectedFile');
            expect(res.body.selectedFile).to.be.a('string');
            expect(res.body).to.have.property('tags');
            expect(res.body.tags).to.be.an('array');
            expect(res.body.tags).to.have.length(2);
            done();
          });
      });
    });

    it('should return no post when given an invalid id', (done) => {
      const fakePostId = Date.now() + 'D2fLfkqzFaz';
      requester
        .get(`/posts/${fakePostId}`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('NOT FOUND');
          done();
        });
    });
  });

  /**
   * Test getPosts route
   */
  describe('GET /posts/', () => {
    it('requires valid user authentication to view posts by page', (done) => {
      PostMessage.create(manyPosts, (err, doc) => {
        if (err) done(err);
        requester.get('/posts').end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Authentication Required');
          done();
        });
      });
    });
    it('allows a verified user to view posts by page', (done) => {
      PostMessage.create(manyPosts, (err, doc) => {
        if (err) done(err);
        requester
          .get('/posts')
          .set('Authorization', `Bearer ${testUserToken}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.have.length(3);
            expect(res.body).to.have.property('numberOfPages');
            expect(res.body.numberOfPages).to.be.a('number');
            expect(res.body).to.have.property('currentPage');
            expect(res.body.currentPage).to.be.a('number');
            done();
          });
      });
    });
  });

  /**
   * Test getPostsBySearch route
   */
  describe('GET /search', () => {
    it('requires valid user authentication before getting post by search params', (done) => {
      PostMessage.create(manyPosts, (err, doc) => {
        if (err) done(err);
        requester
          .get('/posts/search')
          .query({ title: 'Mo', tags: 'folklore,mango,pros-cons' })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Authentication Required');
            done();
          });
      });
    });

    it('allows a verified user to get post(s) by search params', (done) => {
      PostMessage.create(manyPosts, (err, doc) => {
        if (err) done(err);
        requester
          .get('/posts/search')
          .query({ title: 'Mo', tags: 'folklore,mango,pros-cons' })
          .set('Authorization', `Bearer ${testUserToken}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.have.length(3);
            expect(res.body).to.have.property('currentPage');
            expect(res.body.currentPage).to.be.a('number');
            expect(res.body.currentPage).to.equal(1);
            expect(res.body).to.have.property('numberOfPages');
            expect(res.body.numberOfPages).to.be.a('number');
            expect(res.body.numberOfPages).to.equal(1);
            done();
          });
      });
    });
  });

  /**
   * Test commentPost route
   */
  describe('POST commentPost/:id', () => {
    it('requires user to be authenticated before commenting a post', (done) => {
      PostMessage.create(singlePost, (err, doc) => {
        if (err) done(err);
        expect(doc).to.have.property('comments');
        expect(doc.comments).to.be.an('array');
        expect(doc.comments).to.have.length(0);
        requester
          .post(`/posts/${doc._id}/commentPost`)
          .send({
            value: 'This is a beautiful comment comming from your tester.',
          })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Authentication Required');
            done();
          });
      });
    });

    it('allows a verified user to comment a post', (done) => {
      PostMessage.create(singlePost, (err, doc) => {
        if (err) done(err);
        expect(doc).to.have.property('comments');
        expect(doc.comments).to.be.an('array');
        expect(doc.comments).to.have.length(0);
        requester
          .post(`/posts/${doc._id}/commentPost`)
          .send({
            value: 'This is a beautiful comment comming from your tester.',
          })
          .set('Authorization', `Bearer ${testUserToken}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('comments');
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments).to.have.length(1);
            done();
          });
      });
    });
  });

  describe('PATCH posts/:id/likePost', () => {
    it('requires a valid user authentication before commenting a post', (done) => {
      PostMessage.create(singlePost, (err, doc) => {
        if (err) done(err);
        expect(doc).to.have.property('likes');
        expect(doc.likes).to.be.an('array');
        expect(doc.likes).to.have.length(0);
        requester
          .patch(`/posts/${doc._id}/likePost`)
          .send({
            value: 'This is a beautiful comment comming from your tester.',
          })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Authentication Required');
            done();
          });
      });
    });

    it('allows a verified user to like a post', (done) => {
      PostMessage.create(singlePost, (err, doc) => {
        if (err) done(err);
        expect(doc).to.have.property('likes');
        expect(doc.likes).to.be.an('array');
        expect(doc.likes).to.have.length(0);
        requester
          .patch(`/posts/${doc._id}/likePost`)
          .send({
            value: 'This is a beautiful comment comming from your tester.',
          })
          .set('Authorization', `Bearer ${testUserToken}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('likes');
            expect(res.body.likes).to.be.an('array');
            expect(res.body.likes).to.have.length(1);
            done();
          });
      });
    });
  });

  /**
   * Test editPost route
   */
  describe('PATCH /posts/:id/editPost', () => {
    let user1 = {
      email: 'first_user@testing.org',
      id: mongoose.Types.ObjectId(),
    };
    let user2 = {
      email: 'second_user@testing.co.uk',
      id: mongoose.Types.ObjectId(),
    };

    it('requires valid user authentication to update post', (done) => {
      PostMessage.create(
        {
          ...singlePost,
          creator: String(user1.id),
          comments: ['This is so cool!'],
          likes: ['29fj1903dkf1kf8439e39a2'],
        },
        (err, doc) => {
          if (err) return done(err);
          requester
            .patch(`/posts/${doc._id}/editPost`)
            .send({ message: 'Update the previous message' })
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(401);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Authentication Required');
              done();
            });
        },
      );
    });

    it('disallows a verified user from updating a post not created by them', (done) => {
      const user2Token = jwt.sign({ ...user2, id: String(user2.id) }, 'test', {
        expiresIn: '3h',
      });
      PostMessage.create(
        {
          ...singlePost,
          creator: String(user1.id),
          comments: ['This is so cool!'],
          likes: ['29fj1903dkf1kf8439e39a2'],
        },
        (err, doc) => {
          if (err) return done(err);
          requester
            .patch(`/posts/${doc._id}/editPost`)
            .send({ message: 'Update the previous message' })
            .set('Authorization', `Bearer ${user2Token}`)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(403);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Illegal Operation');
              done();
            });
        },
      );
    });

    it('allows a verifed user to update their own post', (done) => {
      const user1Token = jwt.sign({ ...user1, id: String(user1.id) }, 'test', {
        expiresIn: '3h',
      });
      PostMessage.create(
        {
          ...singlePost,
          creator: String(user1.id),
          comments: ['This is so cool!'],
          likes: ['29fj1903dkf1kf8439e39a2'],
        },
        (err, doc) => {
          if (err) return done(err);
          requester
            .patch(`/posts/${doc._id}/editPost`)
            .send({ message: 'Update the previous message.' })
            .set('Authorization', `Bearer ${user1Token}`)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.have.string('Update the previous message.');
              expect(res.body).to.have.property('_id');
              expect(res.body).to.have.property('creator');
              expect(res.body.creator).to.have.string(String(user1.id));
              done();
            });
        },
      );
    });
  });

  /**
   * Test deletePost route
   */
  describe('DEL /posts/:id/deletePost', () => {
    let user1 = {
      email: 'first_user@testing.org',
      id: mongoose.Types.ObjectId(),
    };
    let user2 = {
      email: 'second_user@testing.co.uk',
      id: mongoose.Types.ObjectId(),
    };

    it('requires valid user authentication to delete post', (done) => {
      PostMessage.create(
        {
          ...singlePost,
          creator: String(user1.id),
          comments: ['This is so cool!'],
          likes: ['29fj1903dkf1kf8439e39a2'],
        },
        (err, doc) => {
          if (err) return done(err);
          requester.del(`/posts/${doc._id}/deletePost`).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.have.string('Authentication Required');
            done();
          });
        },
      );
    });

    it('disallows a verified user from deleting a post not created by them', (done) => {
      const user2Token = jwt.sign({ ...user2, id: String(user2.id) }, 'test', {
        expiresIn: '3h',
      });
      PostMessage.create(
        {
          ...singlePost,
          creator: String(user1.id),
          comments: ['This is so cool!'],
          likes: ['29fj1903dkf1kf8439e39a2'],
        },
        (err, doc) => {
          if (err) return done(err);
          requester
            .del(`/posts/${doc._id}/deletePost`)
            .set('Authorization', `Bearer ${user2Token}`)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(403);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.have.string('Illegal Operation');
              done();
            });
        },
      );
    });

    it('allows a verifed user to delete their own post', (done) => {
      const user1Token = jwt.sign({ ...user1, id: String(user1.id) }, 'test', {
        expiresIn: '3h',
      });
      PostMessage.create(
        {
          ...singlePost,
          creator: String(user1.id),
          comments: ['This is so cool!'],
          likes: ['29fj1903dkf1kf8439e39a2'],
        },
        (err, doc) => {
          if (err) return done(err);
          requester
            .del(`/posts/${doc._id}/deletePost`)
            .set('Authorization', `Bearer ${user1Token}`)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Post deleted successfully');
              done();
            });
        },
      );
    });
  });
});
