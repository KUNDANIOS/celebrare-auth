export function drawWatermark(canvas, imageUrl) {
  return new Promise((resolve) => {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Watermark text
      const fontSize = Math.max(20, img.width / 15);
      ctx.font = `bold ${fontSize}px serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Rotate and draw
      ctx.save();
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.fillText("Celebrare", 0, 0);
      ctx.restore();

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = imageUrl;
  });
}