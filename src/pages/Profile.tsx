import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import apiClient from '../api/apiClient';

const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/users/me');
                setUser(response.data);
                setEmail(response.data.email);
            } catch (err) {
                console.error('Failed to fetch user', err);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const updateData: any = { email };
            if (password) updateData.password = password;

            await apiClient.patch('/users/me', updateData);
            setSuccess('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <Navbar isAdmin={user?.admin} />
            <main className="page-container">
                <div className="profile-form animate-fade-in">
                    <h2 className="form-title">Edit Profile</h2>

                    {error && <div className="error-message text-center" style={{ marginBottom: '1rem' }}>{error}</div>}
                    {success && <div style={{ color: 'var(--success-color)', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">New Password (leave blank to keep current)</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;
