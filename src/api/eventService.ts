import apiClient from './apiClient';
import type { CreateEventDto, Event } from './types';

export const eventService = {
    getEvents: async (): Promise<Event[]> => {
        const response = await apiClient.get<Event[]>('/events');
        return response.data;
    },

    createEvent: async (eventData: CreateEventDto): Promise<Event> => {
        const response = await apiClient.post<Event>('/events', eventData);
        return response.data;
    },

    registerForEvent: async (eventId: string): Promise<void> => {
        await apiClient.post(`/events/${eventId}/registrations`);
    },

    unregisterFromEvent: async (eventId: string): Promise<void> => {
        await apiClient.delete(`/events/${eventId}/registrations`);
    },
};
