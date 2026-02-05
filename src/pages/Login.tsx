import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card animate-fade-in">
            <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Please enter your details to sign in
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

                <div className="error-message text-center">{error}</div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="text-center mt-4" style={{ fontSize: '0.875rem', color: var(--text-secondary) }}>
            Don't have an account? <Link to="/register" className="link">Create account</Link>
        </div>
    </div >
  );
};

export default Login;
