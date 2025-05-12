let facemesh;
let video;
let predictions = [];
const lipPoints = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(640, 480); // 創建畫布
  video = createCapture(VIDEO); // 啟用攝影機
  video.size(width, height); // 設置攝影機大小與畫布一致
  video.hide(); // 隱藏原始攝影機畫面（我們會在畫布上繪製）
  video.style('transform', 'scale(-1, 1)'); // 水平翻轉影像，避免翻轉

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
  push();
  translate(width, 0); // 翻轉畫布
  scale(-1, 1); // 水平翻轉畫布
  image(video, 0, 0, width, height); // 在畫布上顯示攝影機畫面
  pop();
  drawLips(); // 繪製嘴唇
}

function drawLips() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh; // 獲取臉部特徵點

    stroke(255, 0, 0); // 紅色線條
    strokeWeight(3); // 線條粗細為3

    for (let i = 0; i < lipPoints.length - 1; i++) {
      const [x1, y1] = keypoints[lipPoints[i]]; // 獲取當前點的座標
      const [x2, y2] = keypoints[lipPoints[i + 1]]; // 獲取下一點的座標
      line(x1, y1, x2, y2); // 繪製兩點之間的線
    }

    // 將最後一點與第一點連接
    const [xStart, yStart] = keypoints[lipPoints[0]];
    const [xEnd, yEnd] = keypoints[lipPoints[lipPoints.length - 1]];
    line(xStart, yStart, xEnd, yEnd);
  }
}
