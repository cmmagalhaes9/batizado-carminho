import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  readonly value: string;
  readonly size?: number;
  readonly darkColor?: string;
  readonly lightColor?: string;
}

/**
 * Renders a QR code into a canvas element.
 * Re-renders when value changes; cleans up nothing because the canvas is the result.
 */
export function QRCodeCanvas({
  value,
  size = 220,
  darkColor = '#4a3a35',
  lightColor = '#fdf9f3',
}: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1,
        color: { dark: darkColor, light: lightColor },
        errorCorrectionLevel: 'M',
      },
      (err) => {
        if (err) {
          console.error('[QR] Failed to render:', err);
        }
      },
    );
  }, [value, size, darkColor, lightColor]);

  return <canvas ref={canvasRef} aria-label={`QR code for ${value}`} />;
}
