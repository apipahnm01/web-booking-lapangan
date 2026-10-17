import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const containerId = useRef(`qr-reader-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const [status, setStatus] = useState<'idle' | 'starting' | 'scanning' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const lastScanRef = useRef<{ text: string; time: number }>({ text: '', time: 0 });

  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    void startScanner();
    return () => { void stopScanner(); };
  }, []);

  async function startScanner() {
    setStatus('starting');
    setErrorMsg('');
    try {
      await stopScanner();
      const scanner = new Html5Qrcode(containerId.current);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const now = Date.now();
          if (decodedText === lastScanRef.current.text && now - lastScanRef.current.time < 3000) return;
          lastScanRef.current = { text: decodedText, time: now };
          onScanRef.current(decodedText);
        },
        () => {}
      );
      setStatus('scanning');
    } catch {
      setStatus('error');
      setErrorMsg('Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan dan situs dibuka melalui HTTPS. Kamu tetap bisa memasukkan kode booking secara manual.');
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return;
    try {
      if (scannerRef.current.isScanning) await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {}
    scannerRef.current = null;
  }

  return (
    <div className="w-full">
      {status === 'error' ? (
        <div className="card text-center py-12">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-white/80 mb-2 font-medium">Kamera Tidak Tersedia</p>
          <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">{errorMsg}</p>
          <button onClick={() => void startScanner()} className="btn-primary"><Camera className="w-5 h-5" /> Coba Lagi</button>
        </div>
      ) : (
        <div className="card p-4">
          <div id={containerId.current} className="w-full max-w-md mx-auto rounded-xl overflow-hidden bg-navy-800" />
          <div className="flex items-center justify-center gap-2 mt-4">
            {status === 'starting' && <><Loader2 className="w-5 h-5 text-brand-400 animate-spin" /><span className="text-sm text-white/60">Memulai kamera...</span></>}
            {status === 'scanning' && <><CheckCircle2 className="w-5 h-5 text-brand-400" /><span className="text-sm text-brand-400">Kamera aktif - Arahkan ke QR Code</span></>}
          </div>
        </div>
      )}
    </div>
  );
}
