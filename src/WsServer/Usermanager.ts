import { connection } from "websocket";
import { Messages } from "../db";

// When a user sends a message to anohter user in messages page then a room is created that must contain two users an it is stored in a db as and object,
// The object created in db is contains the userIds and the messages ,let the object created be called a connection 

export interface msgPayload {
    content: string; // contains the message that needs to be send
    user: string; // contains the userID of the user that has send the message
}
interface User {
    people: [
        user1: string, // Both user1 and user2 contains the userId of the users that are in the chat room
        user2: string
    ]
    conn: [connection] // holds the connection between the users
}
export class Usermanager {
    private Room: Map<string, User>; // It is a map that contains all the rooms that contains the users 
    constructor() {
        this.Room = new Map<string, User>();
    }
    async fetchConnection(user:string,conn:connection){
        
    }
    async addConnection(user1: string, user2: string, message: msgPayload, conn: connection) {

        try {
            // The following constant contains the updated or new created object of, a Connection 
            const Connection = await Messages.findOneAndUpdate({
                connection: [
                    user1,
                    user2
                ]
            },
                { $push: { messages: message } },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                    $setOnInsert: {
                        connection:{ 
                            user1, user2
                    },
                        messages: [message]
                    }
                }
            )
            const roomId: string = Connection._id.toString(); // the Ids of the rooms will be same of the connection object created
            if (!roomId) return "";
            let room = this.Room.get(roomId);
            if (!room) {
                this.Room.set(roomId, {
                    people:[user1,user2],
                    conn:[conn]
                });
            }
            return roomId

        } catch (e) {
            console.log("Error while creating or pushing the array" + e);
        }
    }
    brodcast(roomId: string, messages: msgPayload) {
        const room = this.Room.get(roomId);
        if (!roomId) {
            console.log("Error in broadcast ,Cannot find room");
        }
        room?.people.forEach((id:string)=>{
            if(id === messages.user){return}
            room.conn.forEach((conn)=>{
                conn.emit("message",messages);
            })
        })
    }
}