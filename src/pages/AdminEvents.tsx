import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import apiClient from '../api/apiClient';

interface City {
    id: number;
    city: string;
    countries?: {
        country: string;
    }
}

const AdminEvents: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [cityId, setCityId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [eventsRes, citiesRes, userRes] = await Promise.all([
                apiClient.get('/events'),
                apiClient.get('/events/cities'),
                apiClient.get('/users/me')
            ]);
            setEvents(eventsRes.data);
            setCities(citiesRes.data);
            setUser(userRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
            setError('Failed to load data. Please check your permissions.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await apiClient.post('/events', {
                title,
                description,
                date_time: dateTime,
                city_id: cityId ? parseInt(cityId) : null
            });
            setSuccess('Event created successfully!');
            setTitle('');
            setDescription('');
            setDateTime('');
            setCityId('');
            fetchData(); // Refresh list
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="admin-page">
            <Navbar isAdmin={user?.admin} />
            <main className="page-container">
                <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    <section className="admin-form animate-fade-in" style={{ margin: 0, maxWidth: 'none' }}>
                        <h2 className="form-title">Add New Event</h2>

                        {error && <div className="error-message text-center" style={{ marginBottom: '1rem' }}>{error}</div>}
                        {success && <div style={{ color: 'var(--success-color)', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="title">Event Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        color: 'white',
                                        minHeight: '100px'
                                    }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="dateTime">Date & Time</label>
                                <input
                                    id="dateTime"
                                    type="datetime-local"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="cityId">City</label>
                                <select
                                    id="cityId"
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}
                                    value={cityId}
                                    onChange={(e) => setCityId(e.target.value)}
                                >
                                    <option value="">Select a city</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.city}, {city.countries?.country}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Create Event
                            </button>
                        </form>
                    </section>

                    <section className="events-list">
                        <h2 className="form-title">Existing Events</h2>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {events.map(event => (
                                    <div key={event.id} className="event-card" style={{ padding: '1rem' }}>
                                        <h4 style={{ margin: 0 }}>{event.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            {new Date(event.date_time).toLocaleString()}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', margin: 0 }}>
                                            {event.cities?.city}, {event.cities?.countries?.country}
                                        </p>
                                    </div>
                                ))}
                                {events.length === 0 && <p>No events found.</p>}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminEvents;
