import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQAccordionProps {
  items: FAQItem[];
}
export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, index) =>
      <div
        key={index}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        
          <button
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
          
            <span className="font-semibold text-gray-900 pr-4">
              {item.question}
            </span>
            <ChevronDown
            className={`h-5 w-5 text-teal-600 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
          
          </button>

          <div
          className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
          
            <div className="px-6 pb-4 pt-2 text-gray-600 leading-relaxed border-t border-gray-50">
              {item.answer}
            </div>
          </div>
        </div>
      )}
    </div>);

}