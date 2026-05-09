import { httpPost } from './HttpClient';

interface FieldResult {
  value: string;
  confidence: number;
}

interface LineItemResult {
  sku: string;
  description: string;
  quantity: number;
  tax_rate: number;
  unit_price: number;
  total: number;
  confidence: number;
}

export interface ProcessingApiResponse {
  fields: {
    vendor_name: FieldResult;
    vendor_address: FieldResult;
    bill_to: FieldResult;
    invoice_number: FieldResult;
    date: FieldResult;
  };
  line_items: LineItemResult[];
}

interface UrlPayload {
  document_url: string;
}

interface Base64Payload {
  document_base64: string;
  filename: string;
}

export async function processDocumentUrl(
  url: string,
  signal?: AbortSignal,
): Promise<ProcessingApiResponse> {
  const payload: UrlPayload = { document_url: url };
  return httpPost<UrlPayload, ProcessingApiResponse>('/processing', payload, { signal });
}

export async function processDocumentBase64(
  base64: string,
  filename: string,
  signal?: AbortSignal,
): Promise<ProcessingApiResponse> {
  const payload: Base64Payload = { document_base64: base64, filename };
  return httpPost<Base64Payload, ProcessingApiResponse>('/processing', payload, { signal });
}
