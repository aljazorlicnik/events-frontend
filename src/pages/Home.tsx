import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import apiClient from '../api/apiClient';

interface Event {
    id: number;
    title: string;
    description: string;
    date_time: string;
    image_path?: string;
    cities?: {
        city: string;
        countries?: {
            country: string;
        }
    }
}

const Home: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async (query?: string) => {
        try {
            const response = await apiClient.get('/events', {
                params: query ? { q: query } : {}
            });
            setEvents(response.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await apiClient.get('/users/me');
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await Promise.all([fetchEvents(), fetchUser()]);
            setIsLoading(false);
        };
        init();
    }, []);

    const handleSearch = (query: string) => {
        fetchEvents(query);
    };

    return (
        <div className="home-page">
            <Navbar isAdmin={user?.admin} onSearch={handleSearch} />

            <main className="page-container">
                <header className="page-header">
                    <div>
                        <h1>Upcoming Events</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Discover and join the best events around you
                        </p>
                    </div>
                </header>

                {isLoading ? (
                    <div className="text-center" style={{ padding: '4rem' }}>
                        <p>Loading events...</p>
                    </div>
                ) : (
                    <div className="events-grid animate-fade-in">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-image">
                                        {event.image_path ? (
                                            <img src={event.image_path} alt={event.title} />
                                        ) : (
                                            <span style={{ fontSize: '3rem' }}>📅</span>
                                        )}
                                    </div>
                                    <div className="event-content">
                                        <h3>{event.title}</h3>
                                        <div className="event-date">
                                            {new Date(event.date_time).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        {event.cities && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                📍 {event.cities.city}, {event.cities.countries?.country}
                                            </p>
                                        )}
                                        <p className="event-description">
                                            {event.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>No events found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
