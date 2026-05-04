import { Message } from "@/model/user.model";
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessges?: boolean;
    messages?: Array<Message>
}

