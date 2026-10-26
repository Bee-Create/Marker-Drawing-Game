const canvas = document.querySelector("#drawing-canvas");
const context = canvas.getContext("2d");
const markers = document.querySelectorAll(".marker");
const brushSize = document.querySelector("#brush-size");
const clearButton = document.querySelector("#clear-button");

let currentColor = document.querySelector(".marker.selected").dataset.color;
let isDrawing = false;

function resizeCanvas() {
  const savedDrawing = document.createElement("canvas");
  savedDrawing.width = canvas.width;
  savedDrawing.height = canvas.height;
  savedDrawing.getContext("2d").drawImage(canvas, 0, 0);

  const pixelRatio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();

  canvas.width = bounds.width * pixelRatio;
  canvas.height = bounds.height * pixelRatio;

  context.scale(pixelRatio, pixelRatio);
  context.drawImage(
    savedDrawing,
    0, 0, savedDrawing.width, savedDrawing.height,
    0, 0, bounds.width, bounds.height
  );
}

markers.forEach((marker) => {
  marker.addEventListener("click", () => {
    markers.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });

    marker.classList.add("selected");
    marker.setAttribute("aria-pressed", "true");
    currentColor = marker.dataset.color;
  });
});

canvas.addEventListener("pointerdown", (event) => {
  isDrawing = true;
  canvas.setPointerCapture(event.pointerId);

  const bounds = canvas.getBoundingClientRect();
  context.beginPath();
  context.moveTo(event.clientX - bounds.left, event.clientY - bounds.top);
});

canvas.addEventListener("pointermove", (event) => {
  if (!isDrawing) return;

  const bounds = canvas.getBoundingClientRect();
  context.lineTo(event.clientX - bounds.left, event.clientY - bounds.top);
  context.strokeStyle = currentColor;
  context.lineWidth = brushSize.value;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
});

function stopDrawing() {
  isDrawing = false;
  context.closePath();
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);

clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
