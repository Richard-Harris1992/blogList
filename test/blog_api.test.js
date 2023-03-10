const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('get request', () => { 
    test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000);

    afterAll(async () => {
    await mongoose.connection.close()
    });
});