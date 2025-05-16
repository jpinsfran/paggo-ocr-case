import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_BASE = 'http://localhost:3000'; // Ajuste conforme seu backend

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
      const res = await axios.post(url, { email, password });
      localStorage.setItem('token', res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>{isLogin ? 'Login' : 'Registrar'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Senha:</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
            minLength={6}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Registrar'}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
        <button
          onClick={() => {
            setError('');
            setIsLogin(!isLogin);
          }}
          style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isLogin ? 'Registre-se' : 'Faça login'}
        </button>
      </p>
    </div>
  );
}
