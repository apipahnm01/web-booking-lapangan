import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const containerId = useRef(`qr-reader-${Date.now()}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'scanning' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const lastScanRef = useRef<{ text: string; time: number }>({ text: '', time: 0 });

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    setStatus('starting');
    try {
      const scanner = new Html5Qrcode(containerId.current);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const now = Date.now();
          if (decodedText === lastScanRef.current.text && now - lastScanRef.current.time < 3000) {
            return;
          }
          lastScanRef.current = { text: decodedText, time: now };
          onScan(decodedText);
        },
        () => {}
      );
      setStatus('scanning');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera dan menggunakan HTTPS atau localhost.'
      );
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try {
        const running = scannerRef.current.isScanning;
        if (running) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        /* ignore */
      }
      scannerRef.current = null;
    }
  }

  return (
    <div className="w-full">
      {status === 'error' ? (
        <div className="card text-center py-12">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white/80 mb-2 font-medium">Kamera Tidak Tersedia</p>
          <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">{errorMsg}</p>
          <button onClick={startScanner} className="btn-primary">
            <Camera className="w-5 h-5" />
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="card p-4">
          <div
            id={containerId.current}
            className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-navy-800"
          />
          <div className="flex items-center justify-center gap-2 mt-4">
            {status === 'starting' && (
              <>
                <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
                <span className="text-sm text-white/60">Memulai kamera...</span>
              </>
            )}
            {status === 'scanning' && (
              <>
                <CheckCircle2 className="w-5 h-5 text-brand-400" />
                <span className="text-sm text-brand-400">Kamera aktif - Arahkan ke QR Code</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
