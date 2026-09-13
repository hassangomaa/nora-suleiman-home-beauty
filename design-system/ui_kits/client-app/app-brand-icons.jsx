/* Brand mark inline-SVG icons for auth + payments.
   These render crisply at any size and are bundled with the standalone HTML. */

function AppleMark({ size = 22, color = '#fff' }) {
  return (
    <svg width={size} height={size * 1.22} viewBox="0 0 22 27" fill={color} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18.3 14.3c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1s-2.4-1.1-4-1c-2.1 0-4 1.2-5 3-2.2 3.8-.6 9.4 1.5 12.5 1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.2-1s2.5 1 4.2 1c1.7 0 2.8-1.5 3.9-3 1.2-1.7 1.7-3.4 1.7-3.5-.1-.1-3.3-1.3-3.3-5.2zM15.2 5c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.9-3.7 1.9-.8.9-1.6 2.4-1.4 3.9 1.4.1 2.9-.7 3.8-1.7z" />
    </svg>
  );
}

function GoogleMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" fill="#34A853"/>
      <path d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.95l3.66-2.84Z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
    </svg>
  );
}

/* Apple Pay — uses the real wordmark PNG asset (inlined as data URI by app-logo-asset.js). */
function ApplePayLogo({ height = 22 }) {
  return <img src={window.__APPLE_PAY_LOGO} alt="Apple Pay" style={{ height, width: 'auto', display: 'block', objectFit: 'contain' }} />;
}

/* Mada — Saudi national payment brand. Inline SVG wordmark with their
   signature blue + green color stack. */
function MadaLogo({ height = 22 }) {
  return (
    <svg viewBox="0 0 110 40" style={{ height, width: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg" aria-label="mada">
      <rect width="110" height="40" rx="6" fill="#fff"/>
      <text x="55" y="20" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="15" fill="#2D2E83">mada</text>
      <rect x="20" y="26" width="22" height="3" rx="1.5" fill="#84BD00"/>
      <rect x="44" y="26" width="22" height="3" rx="1.5" fill="#F58220"/>
      <rect x="68" y="26" width="22" height="3" rx="1.5" fill="#2D2E83"/>
    </svg>
  );
}

/* STC Pay — Saudi telecom wallet. Their brand is purple with a curved 'p'. */
function StcPayLogo({ height = 22 }) {
  return (
    <svg viewBox="0 0 110 40" style={{ height, width: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg" aria-label="STC Pay">
      <rect width="110" height="40" rx="6" fill="#4F008C"/>
      <text x="14" y="26" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="16" fill="#fff">stc</text>
      <text x="48" y="26" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="16" fill="#fff" fontStyle="italic">pay</text>
    </svg>
  );
}

/* Visa wordmark */
function VisaLogo({ height = 16 }) {
  return (
    <svg viewBox="0 0 80 26" style={{ height, width: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
      <text x="40" y="20" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontStyle="italic" fontWeight="900" fontSize="22" fill="#1A1F71">VISA</text>
    </svg>
  );
}

Object.assign(window, { AppleMark, GoogleMark, ApplePayLogo, MadaLogo, StcPayLogo, VisaLogo });
