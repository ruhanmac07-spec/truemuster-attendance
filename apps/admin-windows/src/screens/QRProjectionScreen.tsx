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

  const rotateChallenge = () => {
    const newChl = TrueMusterStore.issueNewChallenge(session.id);
    setChallenge(newChl);
    setSecondsLeft(90);
  };

  // Initialize or fetch challenge
  useEffect(() => {
    let current = TrueMusterStore.getActiveChallenge();
    if (!current || new Date(current.expiresAt).getTime() <= Date.now()) {
      current = TrueMusterStore.issueNewChallenge(session.id);
    }
    setChallenge(current);

    const diff = Math.max(0, Math.floor((new Date(current.expiresAt).getTime() - Date.now()) / 1000));
    setSecondsLeft(diff);
  }, [session.id]);

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

        {/* Big QR Code Canvas */}
        <div style={{
          marginTop: Spacing.xl,
          padding: 16,
          display: 'inline-block',
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          border: `2px solid ${Colors.brandNavy}`,
          boxShadow: '0 4px 20px rgba(0, 28, 90, 0.12)',
        }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>

        {/* Dynamic Rotation & Expiry Bar */}
        <div style={{
          marginTop: Spacing.lg,
          maxWidth: 420,
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
