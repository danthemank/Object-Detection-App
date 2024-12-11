import React, { useState } from 'react';

const Camera = ({ onCapture }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        onCapture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    setPreviewImage(null);
  };

  if (previewImage) {
    return (
      <div className="relative">
        <img src={previewImage} alt="uploaded" className="w-full rounded-lg" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={retake}
            className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Upload Another Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
      <div className="text-center">
        <div className="mb-4">
          <span className="text-4xl text-gray-400 dark:text-gray-500">📁</span>
        </div>
        <div className="flex flex-col items-center">
          <label className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer">
            <span>Select Image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Upload an image to identify objects
          </p>
        </div>
      </div>
    </div>
  );
};

export default Camera;
