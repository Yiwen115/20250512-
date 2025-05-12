let facemesh;
let video;
let predictions = [];
const lipPoints = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const leftEyePoints = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
const rightEyePoints = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

function setup() {
  createCanvas(640, 480); // 創建畫布
  video = createCapture(VIDEO); // 啟用攝影機
  video.size(width, height); // 設置攝影機大小與畫布一致
  video.hide(); // 隱藏原始攝影機畫面（我們會在畫布上繪製）

  facemesh = ml5.facemesh(video, modelReady); // 加載 Facemesh 模型
  facemesh.on("predict", (results) => {
    predictions = results; // 儲存偵測結果
  });
  background(200); // 灰色背景
}

function modelReady() {
  console.log("Facemesh model loaded!"); // 確認模型已加載
}

function draw() {
  background(0); // 黑色背景
  image(video, 0, 0, width, height); // 在畫布上顯示攝影機畫面

  // 偵測結果檢查
  if (predictions.length > 0) {
    drawLips(); // 繪製嘴唇
    drawEyes(); // 繪製眼睛
  } else {
    console.log("No face detected"); // 如果沒有偵測到臉部，輸出提示
  }
}

function drawLips() {
  const keypoints = predictions[0].scaledMesh; // 獲取臉部特徵點

  stroke(255, 0, 0); // 紅色線條
  strokeWeight(3); // 線條粗細為3
  noFill();

  beginShape();
  for (let i = 0; i < lipPoints.length; i++) {
    const pointIndex = lipPoints[i];
    if (keypoints[pointIndex]) { // 確保點存在
      const [x, y] = keypoints[pointIndex]; // 獲取嘴唇點的座標
      vertex(x, y); // 在嘴唇點繪製頂點
    }
  }
  endShape(CLOSE); // 將最後一點與第一點連接
}

function drawEyes() {
  const keypoints = predictions[0].scaledMesh; // 獲取臉部特徵點

  stroke(255, 0, 0); // 紅色線條
  strokeWeight(3); // 線條粗細為3

  // 繪製左眼
  for (let i = 0; i < leftEyePoints.length - 1; i++) {
    const [x1, y1] = keypoints[leftEyePoints[i]];
    const [x2, y2] = keypoints[leftEyePoints[i + 1]];
    line(x1, y1, x2, y2); // 繪製兩點之間的線
  }
  const [lx1, ly1] = keypoints[leftEyePoints[0]];
  const [lx2, ly2] = keypoints[leftEyePoints[leftEyePoints.length - 1]];
  line(lx1, ly1, lx2, ly2); // 將左眼最後一點與第一點連接

  // 繪製右眼
  for (let i = 0; i < rightEyePoints.length - 1; i++) {
    const [x1, y1] = keypoints[rightEyePoints[i]];
    const [x2, y2] = keypoints[rightEyePoints[i + 1]];
    line(x1, y1, x2, y2); // 繪製兩點之間的線
  }
  const [rx1, ry1] = keypoints[rightEyePoints[0]];
  const [rx2, ry2] = keypoints[rightEyePoints[rightEyePoints.length - 1]];
  line(rx1, ry1, rx2, ry2); // 將右眼最後一點與第一點連接
}
