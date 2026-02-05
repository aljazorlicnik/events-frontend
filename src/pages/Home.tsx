import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import apiClient from '../api/apiClient';
import { eventService } from '../api/eventService';

import type { Event } from '../api/types';

const Home: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [joiningEventId, setJoiningEventId] = useState<number | null>(null);

    const fetchEvents = async (query?: string) => {
        try {
            const data = await eventService.getEvents();
            // Simple client-side filter since API doesn't support query yet, or it does but for cleanliness
            if (query) {
                const lowerQuery = query.toLowerCase();
                setEvents(data.filter(e =>
                    e.title.toLowerCase().includes(lowerQuery) ||
                    e.description?.toLowerCase().includes(lowerQuery)
                ));
            } else {
                setEvents(data);
                console.log('Fetched events:', data);
                data.forEach(e => {
                    if (e.is_registered) console.log(`Event ${e.id} is registered`);
                });
            }
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
        setJoiningEventId(eventId);
        try {
            await eventService.registerForEvent(eventId);
            await fetchEvents(searchQuery);
        } catch (err: any) {
            console.error('Failed to join event', err);
            const errorMessage = err.response?.data?.message || 'Failed to join event';
            alert(errorMessage); // Simple alert for now, could be a toast later
        } finally {
            setJoiningEventId(null);
        }
    };

    const handleLeaveEvent = async (eventId: number) => {
        setJoiningEventId(eventId);
        try {
            await eventService.unregisterFromEvent(eventId);
            await fetchEvents(searchQuery);
        } catch (err) {
            console.error('Failed to leave event', err);
            alert('Failed to leave event');
        } finally {
            setJoiningEventId(null);
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
                    <>
                        {activeTab === 'all' ? (
                            <div className="events-grid animate-fade-in">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <div key={event.id} className="event-card">
                                            {event.is_registered && (
                                                <div className="registered-badge">Registered</div>
                                            )}
                                            <div className="event-image">
                                                {event.image_path ? (
                                                    <img
                                                        src={event.image_path.startsWith('http') ? event.image_path : `http://localhost:3000${event.image_path}`}
                                                        alt={event.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
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
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        {event.cities.city}, {event.cities.countries?.country}
                                                    </p>
                                                )}
                                                <p className="event-description">
                                                    {event.description || 'No description provided.'}
                                                </p>

                                                <div className="event-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {!event.is_registered ? (
                                                        <button
                                                            className="btn btn-join"
                                                            onClick={() => handleJoinEvent(event.id)}
                                                            disabled={joiningEventId === event.id}
                                                            style={{
                                                                flex: 1,
                                                                opacity: joiningEventId === event.id ? 0.7 : 1,
                                                                cursor: joiningEventId === event.id ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            {joiningEventId === event.id ? 'Joining...' : 'Join Event'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-leave"
                                                            onClick={() => handleLeaveEvent(event.id)}
                                                            disabled={joiningEventId === event.id}
                                                            style={{
                                                                flex: 1,
                                                                opacity: joiningEventId === event.id ? 0.7 : 1,
                                                                cursor: joiningEventId === event.id ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            {joiningEventId === event.id ? 'Leaving...' : 'Leave Event'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>No events found.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="events-list animate-fade-in">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <div key={event.id} className="event-list-item">
                                            <div className="event-list-date">
                                                <span className="event-list-day">{new Date(event.date_time).getDate()}</span>
                                                <span className="event-list-month">{new Date(event.date_time).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div className="event-list-info">
                                                <h3 style={{ marginBottom: '0.25rem' }}>{event.title}</h3>
                                                {event.cities && (
                                                    <div className="event-list-location" style={{ marginBottom: '0.5rem' }}>
                                                        {event.cities.city}, {event.cities.countries?.country}
                                                        <span style={{ margin: '0 0.5rem' }}>•</span>
                                                        {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                )}
                                                <p className="event-list-description">
                                                    {event.description || 'No description provided.'}
                                                </p>
                                            </div>
                                            <div className="event-list-actions">
                                                <button
                                                    className="btn btn-leave"
                                                    onClick={() => handleLeaveEvent(event.id)}
                                                    disabled={joiningEventId === event.id}
                                                    style={{
                                                        padding: '0.5rem 1.5rem',
                                                        maxWidth: '150px',
                                                        opacity: joiningEventId === event.id ? 0.7 : 1,
                                                        cursor: joiningEventId === event.id ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {joiningEventId === event.id ? 'Leaving...' : 'Leave Event'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center" style={{ padding: '4rem', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't joined any events yet.</p>
                                        <button
                                            className="btn btn-primary"
                                            style={{ maxWidth: '200px', margin: '0 auto' }}
                                            onClick={() => setActiveTab('all')}
                                        >
                                            Browse Events
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;
