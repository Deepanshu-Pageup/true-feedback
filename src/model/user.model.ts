import mongoose , {Schema , Document} from "mongoose";


export interface Message {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean;
    messages: Message[];
}

export const messageSchemna: Schema<Message> = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }
)


const userSchema: Schema<User> = new Schema (
    {
        username: {
            type: String,
            required: [ true, "user name is required"],
            lowercase: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please use a valid email']
        },
        password: {
            type: String,
            required: [true, 'password is required'],
        },
        verifyCode: {
            type: String,
            required: [true, 'verfiy code is reqiured'],
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, 'verify code expiry date is requried'],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true,
        },
        messages: {
            type: [messageSchemna],
            required: [true, 'messages is required'],
        }
    },
    {timestamps: true}
)



const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , userSchema))
export default UserModel;