export type DocumentId = string;

export type DocumentStatus =
    | 'idle'
    | 'queued'
    | 'processing'
    | 'completed'
    | 'failed';

export type DocumentSourceType = 'file' | 'url';

export interface DocumentSource {
    type: DocumentSourceType;
    value: string;
    name: string;
    mimeType?: string;
    sizeBytes?: number;
    base64?: string;
}

export interface ExtractedField {
    key: string;
    label: string;
    value: string;
    confidence: number;
    validated: boolean;
}

export interface LineItem {
    index: number;
    sku: string;
    description: string;
    quantity: number;
    taxRate: number;
    unitPrice: number;
    total: number;
    confidence: number;
}

export interface ExtractionResult {
    fields: ExtractedField[];
    lineItems: LineItem[];
    rawJson: Record<string, unknown>;
}

export interface Document {
    id: DocumentId;
    source: DocumentSource;
    status: DocumentStatus;
    previewUrl: string | null;
    extraction: ExtractionResult | null;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function createDocument(
    id: DocumentId,
    source: DocumentSource,
): Document {
    const now = new Date();
    return {
        id,
        source,
        status: 'idle',
        previewUrl: null,
        extraction: null,
        errorMessage: null,
        createdAt: now,
        updatedAt: now,
    };
}

export function updateDocumentStatus(
    doc: Document,
    status: DocumentStatus,
    errorMessage?: string,
): Document {
    return {
        ...doc,
        status,
        errorMessage: errorMessage ?? null,
        updatedAt: new Date(),
    };
}

export function updateDocumentExtraction(
    doc: Document,
    extraction: ExtractionResult,
    previewUrl: string,
): Document {
    return {
        ...doc,
        extraction,
        previewUrl,
        status: 'completed',
        updatedAt: new Date(),
    };
}
