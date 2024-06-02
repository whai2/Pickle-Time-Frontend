import client from '@/apis/axios';
import { MessageType } from '@/apis/types/messages.type';
import { API_CHAT } from '@/constants/API';

export const messages = Object.freeze({
  send: async (body: MessageType, receiverId: string) => {
    const { data } = await client.post(API_CHAT.INQUIRY(receiverId), body);
    return data;
  },

  get: async (receiverId: string) => {
    const { data } = await client.get(API_CHAT.LIST(receiverId));
    return data;
  },
});