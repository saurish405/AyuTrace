declare module 'qrcode.react' {
    import * as React from 'react';
  
    export interface QRCodeProps {
      value: string;
      size?: number;
      bgColor?: string;
      fgColor?: string;
      level?: "L" | "M" | "Q" | "H";
      includeMargin?: boolean;
    }
  
    export const QRCodeSVG: React.FC<QRCodeProps>;
  }
  