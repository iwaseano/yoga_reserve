import React, { useState } from 'react';
import * as api from '../api';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, initialMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      onLoginSuccess(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // フロントエンドバリデーション
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    
    if (!email || !email.includes('@')) {
      setError('有効なメールアドレスを入力してください');
      return;
    }
    
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.register({ name, email, password });
      onLoginSuccess(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登録に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <h2>{isRegister ? '新規登録' : 'ログイン'}</h2>
      
      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        {isRegister && (
          <div className="form-group">
            <label>お名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="山田太郎"
            />
          </div>
        )}
        
        <div className="form-group">
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />
        </div>
        
        <div className="form-group">
          <label>パスワード{isRegister && <span className="hint"> (6文字以上)</span>}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isRegister ? 6 : undefined}
            placeholder="••••••••"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '処理中...' : isRegister ? '登録' : 'ログイン'}
        </button>
      </form>

      <div className="toggle-mode">
        {isRegister ? (
          <>
            アカウントをお持ちの方は{' '}
            <button className="link-button" onClick={() => setIsRegister(false)}>
              ログイン
            </button>
          </>
        ) : (
          <>
            アカウントをお持ちでない方は{' '}
            <button className="link-button" onClick={() => setIsRegister(true)}>
              新規登録
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
