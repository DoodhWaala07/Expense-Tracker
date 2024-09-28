
// import React, { useRef, useEffect } from 'react';

// const loadOpenCV = () => {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = 'https://docs.opencv.org/4.x/opencv.js';
//         script.async = true;
//         script.onload = () => {
//             console.log('OpenCV is ready');
//             resolve(window.cv);
//         };
//         script.onerror = () => {
//             reject(new Error('Failed to load OpenCV.js'));
//         };
//         document.body.appendChild(script);
//     });
// };

// const Test = () => {
//     const fileInputRef = useRef(null);
//     const canvasRef = useRef(null);

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         const img = new Image();
//         img.src = URL.createObjectURL(file);
//         img.onload = () => {
//             if (typeof window.cvReady === 'undefined' || !window.cvReady) {
//                 console.error('OpenCV is not ready');
//                 return;
//             }

//             const src = cv.imread(img);
//             const gray = new cv.Mat();
//             const blurred = new cv.Mat();
//             const edges = new cv.Mat();
//             const contours = new cv.MatVector();

//             // Convert to grayscale
//             cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//             // Apply Gaussian Blur
//             cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

//             // Edge Detection
//             cv.Canny(blurred, edges, 50, 150);

//             // Find contours
//             cv.findContours(edges, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

//             // Find the largest contour
// let largestContour = contours.get(0);
// let largestContourIndex = 0;

// for (let i = 1; i < contours.size(); i++) {
//     if (cv.contourArea(contours.get(i)) > cv.contourArea(largestContour)) {
//         largestContour = contours.get(i);
//         largestContourIndex = i; // Update index of largest contour
//     }
// }

// // Draw the largest contour on the original image
// cv.drawContours(src, contours, largestContourIndex, new cv.Scalar(0, 255, 0), 3);


//             // Show the result
//             cv.imshow(canvasRef.current, src);

//             // Clean up
//             src.delete();
//             gray.delete();
//             blurred.delete();
//             edges.delete();
//             contours.delete();
//         };
//     };

//     return (
//         <div>
//             <h1>Border Detection in Document</h1>
//             <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/*"
//                 onChange={handleImageUpload}
//             />
//             <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
//         </div>
//     );
// };

// export default Test;
