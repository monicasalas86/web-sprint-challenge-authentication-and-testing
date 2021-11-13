const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

it('sanity', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('[POST] api/auth/register', () => {
  let res
  beforeEach(async () => {
    res = await request(server)
      .post('/api/auth/register')
      .send({username: 'monica', password: '1234'})
  })

  it('responds with status 201', async () => {
    expect(res.status).toBe(201)
  })

  it('has 1 user in db', async () => {
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
})
