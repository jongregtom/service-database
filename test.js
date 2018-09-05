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
    await connection.close();
    await db.close();
  });

  it('should insert a service into collection', async () => {

    const mockService = {userId: '1111', zip: '88889', subject: 'hi', text: 'there'};
    DB.addService(mockService, (data) => {
      Service.findOne({userId: '1111'}, function(err, service) {
        if (err) return handleError(err);
        let insertedService = service;
        expect(insertedService.zip).toEqual(mockService.zip);
      });
    });
  });

  it('should get all services by zip code', async () => {
  	DB.getServicesByZip('88889', (data) => {
  	  expect(data.length).toEqual(1)
  	})
  })

  // it('should get all services by zip code', async () => {
  //   const services = db.collection('services');

  //   await services.find({zip: '88889'}, function(err, data) {
  //   	expect(data.length).toEqual(1);
  //   });
  // });
});