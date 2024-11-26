"use client";

import PdfDocument from "@/component/PdfExport/PdfExport";
import { PDFViewer } from "@react-pdf/renderer/lib/react-pdf.browser";

const Export = () => {
  return (
    <div>
      <PDFViewer height={600} width="100%">
        <PdfDocument />
      </PDFViewer>
    </div>
  );
};

export default Export;
