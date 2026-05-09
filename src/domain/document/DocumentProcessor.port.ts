import type { DocumentSource, ExtractionResult } from './Document';

export interface ProcessDocumentRequest {
    source: DocumentSource;
    signal?: AbortSignal;
}

export interface ProcessDocumentResponse {
    previewUrl: string;
    extraction: ExtractionResult;
}

export interface DocumentProcessorPort {
    process(request: ProcessDocumentRequest): Promise<ProcessDocumentResponse>;
}
