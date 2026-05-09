import type { DocumentProcessorPort, ProcessDocumentRequest, ProcessDocumentResponse } from '@/domain/document/DocumentProcessor.port';
import type { ExtractedField, LineItem } from '@/domain/document';

const MOCK_FIELDS: ExtractedField[] = [
  { key: 'vendor_name',    label: 'Vendor Name',    value: 'Sesame Restaurant',            confidence: 0.97, validated: false },
  { key: 'vendor_address', label: 'Vendor Address', value: '51 Quai de Valmy, 75010 Paris', confidence: 0.92, validated: false },
  { key: 'bill_to',        label: 'Bill To',        value: 'Alexandre Dupont',              confidence: 0.88, validated: false },
  { key: 'invoice_number', label: 'Invoice Number', value: 'INV-D0151',                    confidence: 0.95, validated: false },
  { key: 'date',           label: 'Date',           value: '2008-09-26',                   confidence: 1.00, validated: false },
];

const MOCK_LINE_ITEMS: LineItem[] = [
  { index: 1, sku: 'SKU-001', description: 'Soupe du Jour',        quantity: 1, taxRate: 0.10, unitPrice: 5.00, total: 5.00,  confidence: 0.97 },
  { index: 2, sku: 'SKU-002', description: 'Tiramisu',             quantity: 1, taxRate: 0.10, unitPrice: 5.00, total: 5.00,  confidence: 0.95 },
  { index: 3, sku: 'SKU-003', description: 'Baguette Légume / Ch.', quantity: 1, taxRate: 0.10, unitPrice: 6.50, total: 6.50, confidence: 0.98 },
  { index: 4, sku: 'SKU-004', description: 'Thé',                  quantity: 1, taxRate: 0.10, unitPrice: 3.70, total: 3.70,  confidence: 0.99 },
  { index: 5, sku: 'SKU-005', description: 'Smoothie B',           quantity: 1, taxRate: 0.10, unitPrice: 4.50, total: 4.50,  confidence: 0.98 },
];

function buildRawJson(): Record<string, unknown> {
  return {
    fields: {
      vendor_name:    { value: 'Sesame Restaurant',             confidence: 0.97 },
      vendor_address: { value: '51 Quai de Valmy, 75010 Paris', confidence: 0.92 },
      bill_to:        { value: 'Alexandre Dupont',              confidence: 0.88 },
      invoice_number: { value: 'INV-D0151',                     confidence: 0.95 },
      date:           { value: '2008-09-26',                    confidence: 1.00 },
    },
    line_items: MOCK_LINE_ITEMS.map(item => ({
      sku:         item.sku,
      description: item.description,
      quantity:    item.quantity,
      tax_rate:    item.taxRate,
      unit_price:  item.unitPrice,
      total:       item.total,
      confidence:  item.confidence,
    })),
  };
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export class MockDocumentProcessor implements DocumentProcessorPort {
  async process(request: ProcessDocumentRequest): Promise<ProcessDocumentResponse> {
    await delay(2200, request.signal);

    const previewUrl =
      request.source.type === 'url'
        ? request.source.value
        : URL.createObjectURL(
            await fetch(request.source.value).then(r => r.blob()),
          );

    return {
      previewUrl,
      extraction: {
        fields: MOCK_FIELDS,
        lineItems: MOCK_LINE_ITEMS,
        rawJson: buildRawJson(),
      },
    };
  }
}
