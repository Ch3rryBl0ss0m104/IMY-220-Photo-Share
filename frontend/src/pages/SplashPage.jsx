import { useState } from 'react';
import LoginForm from '../components/LoginForm.jsx';
import SignupForm from '../components/SignupForm.jsx';
import './SplashPage.css';

function SplashPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  return (
    <main className="splash">
      <div className="splash__decor splash__decor--dot-1" aria-hidden="true" />
      <div className="splash__decor splash__decor--dot-2" aria-hidden="true" />
      <div className="splash__decor splash__decor--squiggle" aria-hidden="true" />

      <section className="splash__intro">
        <h1 className="splash__logo">Doodlr</h1>
        <p className="splash__tagline">snap it. colour it. share it.</p>

        <div className="splash__pitch">
          <h2>
            your photos deserve <span className="splash__highlight">more colour</span>
          </h2>
          <p>
            Doodlr is where you turn everyday snapshots into little bursts of joy. Share albums with friends,
            discover a world of photos, and hold on to your memories.
          </p>
          <ul className="splash__chips">
            <li className="pill-tag">colourful albums</li>
            <li className="pill-tag">friend feeds</li>
            <li className="pill-tag">hashtag search</li>
          </ul>
        </div>

        <div className="splash__polaroids" aria-hidden="true">
          <span className="splash__polaroid splash__polaroid--blue">beach day</span>
          <span className="splash__polaroid splash__polaroid--mint">picnic day</span>
          <span className="splash__polaroid splash__polaroid--yellow">studio doodles</span>
          <span className="splash__polaroid splash__polaroid--peach">good hair day</span>
        </div>
      </section>

      <section className="splash__auth" aria-label="Log in or sign up">
        <div className="splash__toggle" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'splash__toggle-btn is-active' : 'splash__toggle-btn'}
            onClick={() => setMode('login')}
          >
            log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'splash__toggle-btn is-active' : 'splash__toggle-btn'}
            onClick={() => setMode('signup')}
          >
            sign up
          </button>
        </div>

        {mode === 'login' ? <LoginForm /> : <SignupForm />}

        <p className="splash__switch">
          {mode === 'login' ? (
            <>
              new here?{' '}
              <button type="button" className="splash__link" onClick={() => setMode('signup')}>
                sign up
              </button>
            </>
          ) : (
            <>
              already have an account?{' '}
              <button type="button" className="splash__link" onClick={() => setMode('login')}>
                log in
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default SplashPage;
