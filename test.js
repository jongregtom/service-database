const {MongoClient} = require('mongodb');
const Service = require('./database/index.js');
const DB = require('./database/helpers.js');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__);
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    // await connection.close();
    await connection.dropDatabase();
    await connection.close();
    await db.stop();
    connection = null;
    // await db.close();
    // await db.disconnect();
  });

  it('should insert a service into collection', () => {

    const mockService = {userId: '1111', zip: '88889', subject: 'hi', text: 'there'};
    DB.addService(mockService, (data) => {
      Service.findOne({userId: '1111'}, function(err, service) {
        if (err) return handleError(err);
        let insertedService = service;
        expect(insertedService.zip).toEqual(mockService.zip);
      });
    });
  });
});

describe('retreive', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__);
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    // await connection.close();
    await connection.dropDatabase();
    await connection.close();
    await db.stop();
    connection = null;
    // await db.close();
    // await db.disconnect();
  });

  it('should get all services by zip code', () => {
  	const anotherMockService = {userId: '1111', zip: '88888', subject: 'hi', text: 'there'};
    DB.addService(anotherMockService, (data) => {
      DB.getServicesByZip('88888', (data) => {
  	    expect(data.length).toBeGreaterThan(0);
  	  })
    });
  })
});