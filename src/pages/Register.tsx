import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await authService.register({ email, password });
            // After registration, login automatically or redirect to login
            await authService.login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-card animate-fade-in">
                <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Create Account</h1>
                <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Join us and start managing your events
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="error-message text-center">{error}</div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" className="link">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
