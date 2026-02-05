import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import apiClient from '../api/apiClient';

interface Event {
    id: number;
    title: string;
    description: string;
    date_time: string;
    image_path?: string;
    is_registered?: boolean;
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
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
    const [searchQuery, setSearchQuery] = useState('');

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
        setSearchQuery(query);
        fetchEvents(query);
    };

    const handleJoinEvent = async (eventId: number) => {
        try {
            await apiClient.post(`/events/${eventId}/registrations`);
            await fetchEvents(searchQuery);
        } catch (err) {
            console.error('Failed to join event', err);
        }
    };

    const handleLeaveEvent = async (eventId: number) => {
        try {
            await apiClient.delete(`/events/${eventId}/registrations`);
            await fetchEvents(searchQuery);
        } catch (err) {
            console.error('Failed to leave event', err);
        }
    };

    const filteredEvents = activeTab === 'all'
        ? events
        : events.filter(e => e.is_registered);

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

                <div className="filter-tabs animate-fade-in">
                    <button
                        className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Events
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'mine' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mine')}
                    >
                        My Events
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center" style={{ padding: '4rem' }}>
                        <p>Loading events...</p>
                    </div>
                ) : (
                    <div className="events-grid animate-fade-in">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    {event.is_registered && (
                                        <div className="registered-badge">Registered</div>
                                    )}
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
                                            <span>📅</span>
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
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <span>📍</span> {event.cities.city}, {event.cities.countries?.country}
                                            </p>
                                        )}
                                        <p className="event-description">
                                            {event.description || 'No description provided.'}
                                        </p>

                                        <div className="event-actions">
                                            {event.is_registered ? (
                                                <button
                                                    className="btn btn-leave"
                                                    onClick={() => handleLeaveEvent(event.id)}
                                                >
                                                    Leave Event
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-join"
                                                    onClick={() => handleJoinEvent(event.id)}
                                                >
                                                    Join Event
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {activeTab === 'mine' ? "You haven't joined any events yet." : "No events found."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
