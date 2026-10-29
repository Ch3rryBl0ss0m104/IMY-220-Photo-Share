import './Logo.css';

// Renders "Doodlr" with each letter in its own colour. The colours cycle through the theme palette defined in index.css, so the logo matches the rest of the site.
const LETTER_COLORS = [
  'var(--color-pink, #FF6FA5)',
  'var(--logo-blue, #4DB8FF)',
  'var(--logo-yellow, #FFC93C)',
  'var(--logo-green, #5FCB7B)',
  'var(--logo-purple, #A98CFF)',
  'var(--color-pink-deep, #FF6FA5)',
];

function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`} aria-label="Doodlr">
      {'Doodlr'.split('').map((letter, i) => (
        <span key={i} aria-hidden="true" style={{ color: LETTER_COLORS[i % LETTER_COLORS.length] }}>
          {letter}
        </span>
      ))}
    </span>
  );
}

export default Logo;