"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_setup_1 = require("../config/db-setup");
class User {
    constructor(email, name, password, phone) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.phone = phone;
    }
    addUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, db_setup_1.getDb)().db().collection("TT_Users").insertOne({
                email: this.email,
                name: this.name,
                password: this.password,
                phone: this.phone,
                phoneVerify: false,
                emailVerify: false,
                verified: false,
                createdAt: new Date(),
            });
        });
    }
    static checkEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, db_setup_1.getDb)()
                .db()
                .collection("TT_Users")
                .findOne({ email });
            console.log(user);
            return user;
        });
    }
}
exports.default = User;
