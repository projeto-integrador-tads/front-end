import api from "../index";
import { MESSAGE_ENDPOINTS } from "../endpoints";

export interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  ride_id: string;
  content: string;
  createdAt: Date;
}

export interface PossibleRecipient {
  user_id: string;
  name: string;
  last_name: string;
  is_driver: boolean;
  ride_id: string;
  ride_status: string;
}

export interface Conversation {
  ride_id: string | null;
  driver_id: string;
  driver_name: string;
  driver_last_name: string;
  passenger_id: string;
  passenger_name: string;
  passenger_last_name: string;
  last_message: {
    content: string;
    createdAt: Date;
  };
  ride_details?: {
    start_address: string;
    end_address: string;
    start_time: Date;
    status: string;
    price: number;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

class MessageService {
  async getPossibleRecipients(): Promise<{ recipients: PossibleRecipient[] }> {
    const response = await api.get<{ recipients: PossibleRecipient[] }>(
      MESSAGE_ENDPOINTS.GET_POSSIBLE_RECIPIENTS
    );
    return response.data;
  }

  async getConversations(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<Conversation>> {
    const response = await api.get<PaginatedResponse<Conversation>>(
      MESSAGE_ENDPOINTS.GET_CONVERSATIONS,
      {
        params: { page, perPage },
      }
    );
    return response.data;
  }

  async getMessages(
    rideId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<PaginatedResponse<Message>> {
    const response = await api.get<PaginatedResponse<Message>>(
      MESSAGE_ENDPOINTS.GET_MESSAGES(rideId),
      {
        params: { page, perPage },
      }
    );
    return response.data;
  }

  async sendMessage(data: {
    ride_id: string;
    receiver_id: string;
    content: string;
  }): Promise<Message> {
    const response = await api.post<Message>(MESSAGE_ENDPOINTS.SEND_MESSAGE, data);
    return response.data;
  }
}

export const messageService = new MessageService(); 