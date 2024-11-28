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
exports.Usermanager = void 0;
const db_1 = require("../db");
class Usermanager {
    constructor() {
        this.Room = new Map();
    }
    addConnection(user1, user2, message, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // The following constant contains the updated or new created object of, a Connection 
                const Connection = yield db_1.Messages.findOneAndUpdate({
                    connection: [
                        user1,
                        user2
                    ]
                }, { $push: { messages: message } }, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                    $setOnInsert: {
                        connection: {
                            user1, user2
                        },
                        messages: [message]
                    }
                });
                const roomId = Connection._id.toString(); // the Ids of the rooms will be same of the connection object created
                if (!roomId)
                    return "";
                let room = this.Room.get(roomId);
                if (!room) {
                    this.Room.set(roomId, {
                        people: [user1, user2],
                        conn
                    });
                }
                return roomId;
            }
            catch (e) {
                console.log("Error while creating or pushing the array" + e);
            }
        });
    }
    brodcast(roomId, messages) {
        const room = this.Room.get(roomId);
        if (!roomId) {
            console.log("Error in broadcast ,Cannot find room");
        }
        room === null || room === void 0 ? void 0 : room.people.forEach((id) => {
            if (id === messages.user) {
                return;
            }
            room.conn.emit('message', messages);
        });
    }
}
exports.Usermanager = Usermanager;
