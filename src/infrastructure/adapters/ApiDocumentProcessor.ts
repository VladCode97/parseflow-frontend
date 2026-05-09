import type { DocumentProcessorPort, ProcessDocumentRequest, ProcessDocumentResponse } from '../../domain/document/DocumentProcessor.port';
import type { ExtractedField, LineItem } from '../../domain/document';
import type { ProcessingApiResponse } from '../http/processingApi';
import { processDocumentUrl, processDocumentBase64 } from '../http/processingApi';const FIELD_LABELS: Record<string, string> = {
  vendor_name:    'Vendor Name',
  vendor_address: 'Vendor Address',
  bill_to:        'Bill To',
  invoice_number: 'Invoice Number',
  date:           'Date',
};

function mapFields(raw: ProcessingApiResponse['fields']): ExtractedField[] {
  return (Object.keys(raw) as Array<keyof typeof raw>).map((key) => ({
    key,
    label: FIELD_LABELS[key] ?? key,
    value: raw[key].value,
    confidence: raw[key].confidence,
    validated: false,
  }));
}

function mapLineItems(raw: ProcessingApiResponse['line_items']): LineItem[] {
  return raw.map((item, index) => ({
    index: index + 1,
    sku: item.sku === 'NOT_FOUND' ? '—' : item.sku,
    description: item.description,
    quantity: item.quantity,
    taxRate: item.tax_rate,
    unitPrice: item.unit_price,
    total: item.total,
    confidence: item.confidence,
  }));
}

function buildRawJson(apiResponse: ProcessingApiResponse): Record<string, unknown> {
  return {
    fields: apiResponse.fields,
    line_items: apiResponse.line_items,
  };
}

export class ApiDocumentProcessor implements DocumentProcessorPort {
  async process(request: ProcessDocumentRequest): Promise<ProcessDocumentResponse> {
    let apiResponse: ProcessingApiResponse;
    const previewUrl = request.source.value;

    if (request.source.type === 'url') {
      apiResponse = await processDocumentUrl(request.source.value, request.signal);
    } else {
      const base64 = request.source.base64;
      if (!base64) {
        throw new Error('File base64 data is missing');
      }
      const ext = (request.source.mimeType ?? 'image/jpeg').split('/')[1] ?? 'jpg';
      const filename = request.source.name || `document.${ext}`;
      apiResponse = await processDocumentBase64(base64, filename, request.signal);
    }

    return {
      previewUrl,
      extraction: {
        fields: mapFields(apiResponse.fields),
        lineItems: mapLineItems(apiResponse.line_items),
        rawJson: buildRawJson(apiResponse),
      },
    };
  }
}
