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

    registerForEvent: async (eventId: string | number): Promise<void> => {
        await apiClient.post(`/events/${eventId}/registrations`);
    },

    unregisterFromEvent: async (eventId: string | number): Promise<void> => {
        await apiClient.delete(`/events/${eventId}/registrations`);
    },

    updateEvent: async (eventId: string, eventData: FormData): Promise<Event> => {
        const response = await apiClient.put<Event>(`/events/${eventId}`, eventData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
