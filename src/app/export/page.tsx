"use client";

import PdfDocument from "@/component/PdfExport/PdfExport";
import { PDFViewer } from "@react-pdf/renderer";

const ExportPage = () => (
  <PDFViewer width="100%" height={600}>
    <PdfDocument />
  </PDFViewer>
);

export default ExportPage;
