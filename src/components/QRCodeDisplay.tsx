import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeDisplay({ value, size = 200, className = '' }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: { dark: '#0a1421', light: '#ffffff' },
    }).then(setDataUrl).catch(() => setDataUrl(''));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-white/10 rounded-xl animate-pulse ${className}`}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={`rounded-xl bg-white p-2 ${className}`}
    />
  );
}
