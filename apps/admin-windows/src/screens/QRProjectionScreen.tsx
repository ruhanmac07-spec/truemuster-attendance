import React, { useState, useEffect, useRef } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { TrueMusterStore, AttendanceSession, QRChallenge } from '@truemuster/domain-contracts';
import QRCode from 'qrcode';
import { RefreshCw, Users, Clock, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';

interface Props {
  session: AttendanceSession;
  totalPresent: number;
  onBack: () => void;
  onViewRegister: () => void;
}

export const QRProjectionScreen: React.FC<Props> = ({
  session,
  totalPresent,
  onBack,
  onViewRegister,
}) => {
  const [challenge, setChallenge] = useState<QRChallenge | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mobileUrl = `http://${window.location.hostname === 'localhost' ? '10.68.156.165' : window.location.hostname}:5173`;

  const rotateChallenge = async () => {
    try {
      const res = await fetch('/api/challenge', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
        setSecondsLeft(90);
        return;
      }
    } catch (e) {}
    const newChl = TrueMusterStore.issueNewChallenge(session.id);
    setChallenge(newChl);
    setSecondsLeft(90);
  };

  // Initialize or fetch challenge from server
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch('/api/challenge');
        if (res.ok) {
          const data = await res.json();
          setChallenge(data);
          const diff = Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000));
          setSecondsLeft(diff);
          return;
        }
      } catch (e) {}

      let current = TrueMusterStore.getActiveChallenge();
      if (!current || new Date(current.expiresAt).getTime() <= Date.now()) {
        current = TrueMusterStore.issueNewChallenge(session.id);
      }
      setChallenge(current);
      const diff = Math.max(0, Math.floor((new Date(current.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    fetchChallenge();
  }, [session.id]);

  // Render Mobile Access QR
  useEffect(() => {
    if (mobileCanvasRef.current) {
      QRCode.toCanvas(mobileCanvasRef.current, mobileUrl, {
        width: 140,
        margin: 1,
        color: { dark: '#001C5A', light: '#FFFFFF' },
      });
    }
  }, [mobileUrl]);

  // Render QR Canvas whenever challenge changes
  useEffect(() => {
    if (challenge && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, challenge.token, {
        width: 320,
        margin: 2,
        color: {
          dark: '#001C5A',
          light: '#FFFFFF',
        },
      }, (err) => {
        if (err) console.error('Error rendering QR code', err);
      });
    }
  }, [challenge]);

  // 90-Second Rotation Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          rotateChallenge();
          return 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.id]);

  return (
    <div>
      {/* Top Bar Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: Colors.brandNavy,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={rotateChallenge}
            style={{
              height: 38,
              padding: '0 14px',
              borderRadius: Radii.control,
              backgroundColor: '#FFFFFF',
              border: `1px solid ${Colors.borderDefault}`,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RefreshCw size={15} /> Force Rotate Challenge
          </button>

          <button
            onClick={onViewRegister}
            style={{
              height: 38,
              padding: '0 16px',
              borderRadius: Radii.control,
              backgroundColor: Colors.brandNavy,
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Users size={16} /> Live Register ({totalPresent}/{session.totalEnrolled})
          </button>
        </div>
      </div>

      {/* Projection Stage Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: Radii.card,
        border: `1px solid ${Colors.borderDefault}`,
        boxShadow: '0 8px 32px rgba(0, 28, 90, 0.08)',
        padding: '36px 40px',
        textAlign: 'center',
        maxWidth: 760,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: Colors.brandBlueSoft,
          color: Colors.brandNavy,
          padding: '4px 14px',
          borderRadius: Radii.full,
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: 12,
        }}>
          <ShieldCheck size={16} /> LIVE PROJECTED ATTENDANCE CHALLENGE
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 700, color: Colors.textPrimary }}>
          {session.courseCode} — {session.courseName}
        </h2>
        <p style={{ fontSize: '14px', color: Colors.textSecondary, marginTop: 4 }}>
          {session.section} · {session.roomNumber} · 100m Geofence Anchor Active
        </p>

        {/* QR Displays Grid */}
        <div style={{
          marginTop: Spacing.xl,
          display: 'flex',
          justifyContent: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }}>
          {/* Step 1: Open on Mobile Phone */}
          <div style={{
            padding: '20px 24px',
            backgroundColor: '#F8FAFC',
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            maxWidth: 240,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              color: Colors.brandNavy,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              Step 1: Open on Phone
            </div>
            <div style={{
              padding: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: Radii.control,
              display: 'inline-block',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <canvas ref={mobileCanvasRef} style={{ display: 'block' }} />
            </div>
            <div style={{ fontSize: '12px', color: Colors.textSecondary, marginTop: 8 }}>
              Scan with phone camera or visit:
            </div>
            <a
              href={mobileUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563EB',
                display: 'block',
                marginTop: 2,
                wordBreak: 'break-all',
              }}
            >
              {mobileUrl}
            </a>
          </div>

          {/* Step 2: Main Rotating Attendance Challenge */}
          <div style={{
            padding: '20px 24px',
            backgroundColor: '#FFFFFF',
            borderRadius: Radii.card,
            border: `2px solid ${Colors.brandNavy}`,
            boxShadow: '0 8px 24px rgba(0, 28, 90, 0.12)',
            maxWidth: 360,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              color: Colors.brandRed,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              Step 2: Scan Session QR
            </div>
            <div style={{
              padding: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: Radii.control,
              display: 'inline-block',
            }}>
              <canvas ref={canvasRef} style={{ display: 'block' }} />
            </div>

            <div style={{
              marginTop: 12,
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: Colors.brandNavy,
              backgroundColor: Colors.brandBlueSoft,
              padding: '6px 12px',
              borderRadius: Radii.control,
            }}>
              TOKEN: {challenge?.token || 'GENERATING...'}
            </div>
          </div>
        </div>

        {/* Dynamic Rotation & Expiry Bar */}
        <div style={{
          marginTop: Spacing.lg,
          maxWidth: 480,
          margin: '24px auto 0',
          backgroundColor: Colors.surfaceCanvas,
          padding: '12px 18px',
          borderRadius: Radii.control,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: Colors.textSecondary, fontWeight: 600 }}>
              QR Code Rotates In:
            </span>
            <span style={{
              fontSize: '20px',
              fontWeight: 700,
              color: secondsLeft <= 15 ? Colors.brandRed : Colors.brandNavy,
              fontVariantNumeric: 'tabular-nums',
            }}>
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: 6,
            width: '100%',
            backgroundColor: '#CBD5E1',
            borderRadius: 3,
            overflow: 'hidden',
            marginTop: 8,
          }}>
            <div style={{
              height: '100%',
              width: `${(secondsLeft / 90) * 100}%`,
              backgroundColor: secondsLeft <= 15 ? Colors.brandRed : Colors.brandNavy,
              transition: 'width 1s linear',
            }} />
          </div>

          <div style={{ marginTop: 8, fontSize: '12px', color: Colors.textSecondary, fontFamily: 'monospace' }}>
            Token ID: {challenge?.token || 'GENERATING...'}
          </div>
        </div>

        {/* Guidance for Students */}
        <p style={{
          marginTop: Spacing.xl,
          fontSize: '13px',
          color: Colors.textSecondary,
          lineHeight: 1.5,
          maxWidth: 520,
          margin: '24px auto 0',
        }}>
          Students must scan this code using the <strong>TRUEMUSTER Student Android App</strong> on their enrolled device. After scanning, students have 45 seconds to complete biometric authorization within the classroom geofence.
        </p>
      </div>
    </div>
  );
};
