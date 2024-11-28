import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { msgPayload, Usermanager } from './Usermanager';

interface Payload{
  user1:string,
  user2:string,
  message:msgPayload
}
const app = express();
const server = http.createServer(app);
const userManger = new Usermanager();
const io = new Server(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"]
  },
});


io.on('connection', (client) => {
  console.log('A user connected');

 client.on('message',async(data:any)=>{
  console.log(data);
  messageHandler(data,client);
 })
  client.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Ws Server is online');
});

async function messageHandler(message: Payload , conn : any){
  const roomId : string = await userManger.addConnection(message.user1,message.user2,message.message,conn) || ""; //The connection id or roome=Id for the users is the objectId of the in the database
  userManger.brodcast(roomId,message.message)
}

// To add a logic in the backend so that the userId id send along when the user is connected to the backend and connection Id is created