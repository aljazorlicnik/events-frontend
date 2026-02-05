import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import apiClient from '../api/apiClient';
import ConfirmationModal from '../components/ui/ConfirmationModal';

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

    // Edit state
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleEdit = (event: any) => {
        setEditingEventId(event.id);
        setTitle(event.title);
        setDescription(event.description);
        setDateTime(event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '');
        setCityId(event.cities?.id || '');
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingEventId(null);
        setTitle('');
        setDescription('');
        setDateTime('');
        setCityId('');
        setSelectedFile(null);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date_time', dateTime);
        if (cityId) formData.append('city_id', cityId);
        if (selectedFile) formData.append('image', selectedFile);

        try {
            if (editingEventId) {
                await apiClient.put(`/events/${editingEventId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSuccess('Event updated successfully!');
            } else {
                await apiClient.post('/events', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setSuccess('Event created successfully!');
            }

            setTitle('');
            setDescription('');
            setDateTime('');
            setCityId('');
            setSelectedFile(null);
            setEditingEventId(null);
            fetchData(); // Refresh list
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || `Failed to ${editingEventId ? 'update' : 'create'} event`);
        }
    };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<any>(null);

    const handleDeleteClick = (event: any) => {
        setEventToDelete(event);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;

        setDeletingId(eventToDelete.id);
        try {
            await apiClient.delete(`/events/${eventToDelete.id}`);
            setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
            setSuccess('Event deleted successfully');
            setDeleteModalOpen(false);
            setEventToDelete(null);
        } catch (err) {
            console.error('Failed to delete event', err);
            setError('Failed to delete event');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="admin-page">
            <Navbar isAdmin={user?.admin} />
            <main className="page-container">
                <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    <section className="admin-form animate-fade-in" style={{ margin: 0, maxWidth: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="form-title" style={{ margin: 0 }}>
                                {editingEventId ? 'Edit Event' : 'Add New Event'}
                            </h2>
                            {editingEventId && (
                                <button
                                    onClick={handleCancel}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--text-secondary)',
                                        color: 'var(--text-secondary)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

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

                            <div className="input-group">
                                <label htmlFor="image">Event Image</label>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                {editingEventId ? 'Update Event' : 'Create Event'}
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
                                        {event.image_path && (
                                            <img
                                                src={event.image_path.startsWith('http') ? event.image_path : `http://localhost:3000${event.image_path}`}
                                                alt={event.title}
                                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
                                            />
                                        )}
                                        <h4 style={{ margin: 0 }}>{event.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            {new Date(event.date_time).toLocaleString()}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', margin: 0 }}>
                                            {event.cities?.city}, {event.cities?.countries?.country}
                                        </p>
                                        <div style={{ marginTop: '0.75rem' }}>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="btn"
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    fontSize: '0.85rem',
                                                    marginRight: '0.5rem'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(event)}
                                                className="btn"
                                                disabled={deletingId === event.id}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    fontSize: '0.85rem',
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    border: '1px solid rgba(239, 68, 68, 0.5)',
                                                    color: '#ef4444',
                                                    cursor: deletingId === event.id ? 'not-allowed' : 'pointer',
                                                    opacity: deletingId === event.id ? 0.7 : 1
                                                }}
                                            >
                                                {deletingId === event.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {events.length === 0 && <p>No events found.</p>}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => !deletingId && setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Event"
                message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
                isLoading={!!deletingId}
            />
        </div>
    );
};

export default AdminEvents;
