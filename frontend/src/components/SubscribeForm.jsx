import { useState } from 'react';
import './SubscribeForm.css';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validateEmail(email)) {
      setStatus('invalid');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = 'https://eqysflxgv2.execute-api.ap-southeast-2.amazonaws.com/prod/subscribe';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '4SEOMW3PxG8QiM96PgsaR1U3kXH4AXc51MWoe27b'
        },
        body: JSON.stringify({ email, city: 'Melbourne' })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setShowPopup(true);
        setEmail('');
      } else {
        setStatus('error');
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }

    setLoading(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
        <form onSubmit={handleSubmit} className="subscribe-form-inline">
        <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
        </button>

        {status === 'invalid' && (
            <p className="subscribe-message error">Please enter a valid email address.</p>
        )}
        {status === 'error' && (
            <p className="subscribe-message error">Something went wrong. Try again.</p>
        )}
        </form>

      {showPopup && (
        <div className="subscribe-popup">
          <button className="popup-close" onClick={closePopup}>×</button>
          <p className="popup-text">
            You're subscribed! Please check your email — and don’t forget to check your spam folder.
          </p>
          <button className="popup-action" onClick={closePopup}>Let’s go!</button>
        </div>
      )}
    </>
  );
}
