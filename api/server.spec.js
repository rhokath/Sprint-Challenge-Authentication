const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

describe('server.js', ()=> {
    // beforeEach(async ()=> {
    //     await db('users').truncate();
    // })
    it('should set environment to testing', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })
    describe('GET /api/jokes', () => {
        it('returns JSON', done => {
            request(server)
                .get('/api/jokes')
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                    done();
                })
        })
        it('it should require authorization', () => {
            return request(server)
                .get('/api/jokes')
                .then(res => {
                    expect(res.status).toBe(400);
                    expect(res.body.message).toBe('no credentials provided')
                })
        })
        it('should set environment to testing', () => {
            expect(process.env.DB_ENV).toBe('testing')
        })
    })
    describe('/api/auth/register', () => {
        beforeEach(async ()=> {
            await db('users').truncate()
        })
        it('returns JSON', done => {
            request(server)
                .post('/api/auth/register').send({username: 'test', password: 'test'})
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                    done();
                })
        })
        it('returns 201 ok', () => {
            return request(server)
                .post('/api/auth/register').send({"username": "mary", "password": "bob" })
                .then((res, err) => {
                    console.log(err)
                    expect(res.status).toBe(201);
                })
        })
        
    })
    describe('/api/auth/login', () => {
        it('returns json', done => {
            request(server)
            .post('/api/auth/login').send({"username": "test", "password": "test"})
            .then(res => {
                expect(res.type).toMatch(/json/i);
                done();
            })

        })
        it('registering a new user', ()=> {
            return request(server)
            .post('/api/auth/register').send({"username": "test", "password": "test"})
            .then(res => {
                expect(res.status).toBe(201)
            })          })
        it('returns status should be 200',() => {
              return request(server)
          
            .post('/api/auth/login').send({"username": "test", "password": "test"})
            .then(res => {
                expect(res.status).toBe(200)
            })
        
        })
    })
})