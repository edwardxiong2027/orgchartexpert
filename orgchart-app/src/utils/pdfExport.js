import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPDF(elementId, filename = "orgchart.pdf") {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Element not found");

  // Hide controls during capture
  const controls = element.querySelectorAll(
    ".react-flow__controls, .react-flow__minimap, .no-print"
  );
  controls.forEach((el) => (el.style.display = "none"));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  // Restore controls
  controls.forEach((el) => (el.style.display = ""));

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Determine orientation
  const isLandscape = imgWidth > imgHeight;
  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a3",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const availWidth = pdfWidth - margin * 2;
  const availHeight = pdfHeight - margin * 2;

  const ratio = Math.min(availWidth / imgWidth, availHeight / imgHeight);
  const finalW = imgWidth * ratio;
  const finalH = imgHeight * ratio;

  const x = (pdfWidth - finalW) / 2;
  const y = (pdfHeight - finalH) / 2;

  pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
  pdf.save(filename);
}

export async function exportToPNG(elementId, filename = "orgchart.png") {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Element not found");

  const controls = element.querySelectorAll(
    ".react-flow__controls, .react-flow__minimap, .no-print"
  );
  controls.forEach((el) => (el.style.display = "none"));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  controls.forEach((el) => (el.style.display = ""));

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
