import { Report } from '../types';

export function generateDoc(report: Report): void {
  // Create Word-compatible HTML structure
  const docContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${report.title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: "Calibri", sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      margin: 1in;
    }
    .title {
      font-size: 24pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 12pt;
      color: #2B579A;
    }
    .date {
      text-align: center;
      color: #666666;
      margin-bottom: 24pt;
    }
    .summary {
      background: #F3F6F9;
      padding: 12pt;
      margin-bottom: 24pt;
      border: 1pt solid #D0D7DE;
    }
    .summary h2 {
      color: #2B579A;
      font-size: 14pt;
      margin-top: 0;
      margin-bottom: 12pt;
    }
    .section {
      margin-bottom: 24pt;
    }
    .section h2 {
      color: #2B579A;
      font-size: 14pt;
      border-bottom: 1pt solid #D0D7DE;
      padding-bottom: 6pt;
      margin-bottom: 12pt;
    }
    .content {
      margin-bottom: 12pt;
      white-space: pre-wrap;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12pt;
    }
    td, th {
      border: 1pt solid #D0D7DE;
      padding: 6pt;
    }
    th {
      background: #F3F6F9;
      font-weight: bold;
    }
    @page {
      size: 8.5in 11in;
      margin: 1in;
    }
    @page Section1 {
      mso-header-margin: .5in;
      mso-footer-margin: .5in;
      mso-header: h1;
      mso-footer: f1;
    }
    div.Section1 { page: Section1; }
    p.MsoHeader, p.MsoFooter {
      margin: 0;
      font-size: 9pt;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <div class="title">${report.title}</div>
    <div class="date">Generated on ${new Date(report.date).toLocaleDateString()}</div>
    
    <div class="summary">
      <h2>Executive Summary</h2>
      <div class="content">${report.summary}</div>
    </div>
    
    ${report.sections.map(section => `
      <div class="section">
        <h2>${section.title}</h2>
        <div class="content">${section.content}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  // Create a blob with Word-specific MIME type
  const blob = new Blob([docContent], { 
    type: 'application/vnd.ms-word;charset=utf-8' 
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SaaS_Financial_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}