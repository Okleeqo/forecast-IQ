import jsPDF from 'jspdf';

interface ReportSection {
  title: string;
  content: string;
}

interface Report {
  title: string;
  date: string;
  summary: string;
  sections: ReportSection[];
}

export function generatePDF(report: Report): void {
  const doc = new jsPDF();
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    return y + (lines.length * fontSize * 0.352) + 5;
  };

  // Add title
  doc.setFont("helvetica", "bold");
  yPos = addWrappedText(report.title, yPos, 18);

  // Add date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  yPos += 5;
  doc.text(`Generated on ${new Date(report.date).toLocaleDateString()}`, margin, yPos);
  yPos += 10;

  // Add summary
  doc.setFont("helvetica", "bold");
  yPos = addWrappedText("Executive Summary", yPos, 14);
  yPos += 5;
  doc.setFont("helvetica", "normal");
  yPos = addWrappedText(report.summary, yPos);
  yPos += 10;

  // Add sections
  report.sections.forEach((section) => {
    // Check if we need a new page
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPos = 20;
    }

    // Section title
    doc.setFont("helvetica", "bold");
    yPos = addWrappedText(section.title, yPos, 14);
    yPos += 5;

    // Section content
    doc.setFont("helvetica", "normal");
    yPos = addWrappedText(section.content, yPos);
    yPos += 10;
  });

  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  doc.save(`SaaS_Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}