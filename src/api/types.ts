export interface AuthResponse {
    access_token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    date_time: string;
    image_path?: string;
    is_registered?: boolean;
    max_attendees?: number;
    registrations_count?: number;
    cities?: {
        city: string;
        countries?: {
            country: string;
        }
    };
}

export interface CreateEventDto {
    name: string;
    description: string;
    date: string;
    location: string;
}
