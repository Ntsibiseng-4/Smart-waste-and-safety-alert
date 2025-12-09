
// Simulates cryptographic functions for the prototype

export const generateHash = async (data: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const encryptData = (data: string): { encrypted: string; key: string } => {
  // In a real app, this would use Web Crypto API for AES-GCM
  // For prototype, we simulate an encrypted blob string
  const key = `KEY-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
  const encrypted = `ENC-${btoa(data.substring(0, 50))}...[AES-256-ENCRYPTED-BLOB]`;
  return { encrypted, key };
};

// Edge Processing: Creates a blurred version of the image for privacy
export const createBlurredPreview = (base64Image: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Downscale significantly to lose detail (Privacy)
      const w = img.width / 20;
      const h = img.height / 20;
      canvas.width = w;
      canvas.height = h;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        // Returns a very small pixelated base64
        resolve(canvas.toDataURL());
      }
    };
    img.src = base64Image;
  });
};
