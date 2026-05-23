self.onmessage = async (e) => {
  const { imageUrl, id } = e.data;

  try {
    // Fetch image as blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    // Draw on OffscreenCanvas
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    // Draw watermark
    const fontSize = Math.max(20, bitmap.width / 15);
    ctx.font = `bold ${fontSize}px serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(bitmap.width / 2, bitmap.height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText("Celebrare", 0, 0);
    ctx.restore();

    // Convert to blob and send back
    const outputBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
    const arrayBuffer = await outputBlob.arrayBuffer();

    self.postMessage({ id, buffer: arrayBuffer, success: true }, [arrayBuffer]);
  } catch (err) {
    self.postMessage({ id, success: false, error: err.message });
  }
};