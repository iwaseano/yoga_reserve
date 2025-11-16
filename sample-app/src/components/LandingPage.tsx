import React from 'react';

interface LandingPageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="landing-page">
      {/* ヒーローセクション */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🧘‍♀️ 心と体を整える</h1>
          <h2 className="hero-subtitle">あなたのためのヨガ教室</h2>
          <p className="hero-description">
            初心者から経験者まで、あなたのレベルに合わせたクラスをご用意しています。
            <br />
            オンラインで簡単予約、好きな時間に通えます。
          </p>
          <div className="hero-buttons">
            <button className="btn-hero-primary" onClick={onShowRegister}>
              無料で始める
            </button>
            <button className="btn-hero-secondary" onClick={onShowLogin}>
              ログイン
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">🧘‍♀️</div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="features-section">
        <h2 className="section-title">選ばれる理由</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>簡単予約</h3>
            <p>24時間いつでもオンラインで予約可能。空き状況が一目でわかります。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>多彩なクラス</h3>
            <p>ベーシック、パワー、リラックスなど、目的に合わせたクラスをご用意。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💚</div>
            <h3>初心者歓迎</h3>
            <p>初めての方でも安心。丁寧な指導で基礎から学べます。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕐</div>
            <h3>柔軟な時間</h3>
            <p>朝9時から夕方6時まで、あなたのライフスタイルに合わせて選べます。</p>
          </div>
        </div>
      </section>

      {/* クラス紹介セクション */}
      <section className="classes-section">
        <h2 className="section-title">クラス紹介</h2>
        <div className="classes-grid">
          <div className="class-card">
            <div className="class-icon">🌱</div>
            <h3>ベーシックヨガ</h3>
            <p className="class-duration">60分</p>
            <p>初心者向けの基本的なヨガレッスン。呼吸法とポーズの基本を学びます。</p>
          </div>
          <div className="class-card">
            <div className="class-icon">💪</div>
            <h3>パワーヨガ</h3>
            <p className="class-duration">75分</p>
            <p>よりアクティブで体力を使うヨガクラス。体幹を鍛えたい方におすすめ。</p>
          </div>
          <div className="class-card">
            <div className="class-icon">🌙</div>
            <h3>リラックスヨガ</h3>
            <p className="class-duration">60分</p>
            <p>ストレス解消とリラクゼーションに重点を置いたヨガです。</p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>今日から始めませんか?</h2>
          <p>新規登録で初回レッスンを体験できます</p>
          <button className="btn-cta" onClick={onShowRegister}>
            無料登録する
          </button>
        </div>
      </section>

      {/* フッター */}
      <footer className="footer">
        <p>&copy; 2025 ヨガ教室予約システム. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
