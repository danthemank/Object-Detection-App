export const compressImage = async (base64String, maxWidth = 800) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          const base64Data = compressedBase64.split(',')[1];
          
          resolve(base64Data);
        } catch (e) {
          console.error('Error during image compression:', e);
          reject(new Error('Failed to compress image: ' + e.message));
        }
      };
      
      img.onerror = (e) => {
        console.error('Error loading image:', e);
        reject(new Error('Failed to load image'));
      };

      if (!base64String.startsWith('data:image')) {
        base64String = 'data:image/jpeg;base64,' + base64String;
      }
      
      img.src = base64String;
    } catch (e) {
      console.error('Error in compressImage:', e);
      reject(new Error('Failed to process image: ' + e.message));
    }
  });
};

export const createImageDescription = async (base64Image) => {
  try {
    const binaryStr = atob(base64Image);
    const sizeInMB = binaryStr.length / (1024 * 1024);
    return `[Image data: ${sizeInMB.toFixed(2)}MB, base64 encoded]`;
  } catch (e) {
    console.error('Error creating image description:', e);
    return '[Image data: size unknown]';
  }
};
