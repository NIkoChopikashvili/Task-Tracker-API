"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDb = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const dotenv_1 = __importDefault(require("dotenv"));
// dotenv.config({
//   path: path.join(path.dirname(require.main!.filename), "../.env"),
// });
dotenv_1.default.config();
const MongoClient = mongodb_1.default.MongoClient;
const mongoDbUrl = process.env.MONGODB_URI;
let _db;
// mongodb+srv://admin:mgfFa6nDMBs24Aox@money-market.dvijb.mongodb.net/money_market?retryWrites=true&w=majority
const initDb = (callback) => {
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
exports.initDb = initDb;
const getDb = () => {
    if (!_db) {
        throw Error("Database not initialzed");
    }
    return _db;
};
exports.getDb = getDb;
