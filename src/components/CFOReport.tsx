import React from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

interface ReportSection {
  title: string;
  content: string;
  metrics?: Record<string, string | number>;
}

interface CFOReportProps {
  report: {
    title: string;
    summary: string;
    sections: ReportSection[];
    date: string;
  };
  onDownload: () => void;
}

export default function CFOReport({ report, onDownload }: CFOReportProps) {
  const [expandedSections, setExpandedSections] = React.useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Generated on {new Date(report.date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
        
        <div className="prose max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Executive Summary</h3>
            <p className="text-blue-800">{report.summary}</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {report.sections.map((section, index) => (
          <div key={index} className="p-6">
            <button
              onClick={() => toggleSection(index)}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              {expandedSections.has(index) ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.has(index) && (
              <div className="mt-4 prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap">{section.content}</div>
                
                {section.metrics && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {Object.entries(section.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}