export const compressImage = (base64String, maxWidth) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64String;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress as JPEG with 0.7 quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(compressedBase64);
    };
    
    img.onerror = (error) => reject(error);
  });
};
