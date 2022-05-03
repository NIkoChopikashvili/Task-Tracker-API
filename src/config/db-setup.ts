import mongodb from "mongodb";
import dotenv from "dotenv";
// dotenv.config({
//   path: path.join(path.dirname(require.main!.filename), "../.env"),
// });
dotenv.config();
const MongoClient = mongodb.MongoClient;

const mongoDbUrl: any = process.env.MONGODB_URI;

let _db: mongodb.MongoClient;
// mongodb+srv://admin:mgfFa6nDMBs24Aox@money-market.dvijb.mongodb.net/money_market?retryWrites=true&w=majority

export const initDb = (callback: any) => {
  if (_db) {
    console.log("Database is already initialized!");
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl, { useUnifiedTopology: true })
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

export const getDb = (): mongodb.MongoClient => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};
