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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Usermanager_1 = require("./Usermanager");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const userManger = new Usermanager_1.Usermanager();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});
io.on('connection', (client) => {
    console.log('A user connected');
    client.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        messageHandler(data, client);
    }));
    client.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
server.listen(3001, () => {
    console.log('Ws Server is online');
});
function messageHandler(message, conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = (yield userManger.addConnection(message.user1, message.user2, message.message, conn)) || ""; //The connection id or roome=Id for the users is the objectId of the in the database
        userManger.brodcast(roomId, message.message);
    });
}
// To add a logic in the backend so that the userId id send along when the user is connected to the backend and connection Id is created
