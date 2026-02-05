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
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    // Add other fields as needed based on backend response
}

export interface CreateEventDto {
    name: string;
    description: string;
    date: string;
    location: string;
}
