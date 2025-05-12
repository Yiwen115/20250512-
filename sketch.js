let facemesh;
let video;
let predictions = [];
const lipPoints = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(640, 480); // 調整畫布大小
  video = createCapture(VIDEO);
  video.size(width, height); // 設置與畫布相同大小
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(0); // 黑色背景
  image(video, 0, 0, width, height); // 顯示影像
  drawLips();
}

function drawLips() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    stroke(255, 0, 0); // 紅色
    strokeWeight(3); // 線條粗細為3
    noFill();

    beginShape();
    for (let i = 0; i < lipPoints.length; i++) {
      const pointIndex = lipPoints[i];
      const [x, y] = keypoints[pointIndex]; // 獲取嘴唇點的座標
      vertex(x, y); // 在嘴唇點繪製頂點
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}
