// Load MediaPipe Pose
const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  staticImageMode: true,
});

// Get canvas and context
const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");

// When pose results are ready
pose.onResults((results) => {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 2,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 1,
    });

    const measurements = calculateMeasurements(results.poseLandmarks);
    console.log("Estimated Measurements:", measurements);

    document.getElementById("heightValue").textContent = measurements.height + " in";
    document.getElementById("shoulderValue").textContent = measurements.shoulderWidth + " in";
    document.getElementById("hipValue").textContent = measurements.hip + " in";
    document.getElementById("waistValue").textContent = measurements.waist + " in";
    document.getElementById("inseamValue").textContent = measurements.inseam + " in";
  }
});

// When the page loads: load image from virtual.html and analyze it
window.onload = function () {
  const bodyImageData = localStorage.getItem("uploadedBody");

  if (bodyImageData) {
    const img = new Image();
    img.onload = function () {
      canvasElement.width = img.width;
      canvasElement.height = img.height;
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(img, 0, 0);

      // ✅ Send to MediaPipe for analysis
      pose.send({ image: img });
    };
    img.src = bodyImageData;
  } else {
    console.log("No uploadedBody found in localStorage.");
  }
};

// 🧠 Measurement calculation
function calculateMeasurements(landmarks, assumedHeightInches = 65) {
  const pxToInch = (px) => (assumedHeightInches / estimatedHeightPx) * px;

  function distance(p1, p2) {
    if (!p1 || !p2 || typeof p1.x !== "number" || typeof p2.x !== "number") return 0;
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  const topHead = landmarks[0]; // Nose
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftAnkle = landmarks[27];

  const midHip = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  };

  const headLengthPx = distance(topHead, midHip);

  if (headLengthPx === 0) {
    return {
      height: "N/A",
      shoulderWidth: "N/A",
      hip: "N/A",
      waist: "N/A",
      inseam: "N/A",
    };
  }

  const estimatedHeightPx = headLengthPx * 7.5;

  const shoulderWidthPx = distance(leftShoulder, rightShoulder);
  const hipWidthPx = distance(leftHip, rightHip);
  const inseamPx = distance(leftHip, leftAnkle);

  const leftWaist = {
    x: (leftShoulder.x + leftHip.x) / 2,
    y: (leftShoulder.y + leftHip.y) / 2,
  };
  const rightWaist = {
    x: (rightShoulder.x + rightHip.x) / 2,
    y: (rightShoulder.y + rightHip.y) / 2,
  };

  const waistWidthPx = distance(leftWaist, rightWaist);

  return {
    height: (pxToInch(estimatedHeightPx)).toFixed(1),
    shoulderWidth: (pxToInch(shoulderWidthPx)).toFixed(1),
    hip: (pxToInch(hipWidthPx)).toFixed(1),
    waist: (pxToInch(waistWidthPx)).toFixed(1),
    inseam: (pxToInch(inseamPx)).toFixed(1),
  };
}
