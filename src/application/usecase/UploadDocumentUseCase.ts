import type { DocumentRepositoryPort } from '../../domain/document/DocumentRepository.port';
import type { DocumentProcessorPort } from '../../domain/document/DocumentProcessor.port';
import type { DocumentSource } from '../../domain/document';
import {
  createDocument,
  updateDocumentStatus,
  updateDocumentExtraction,
} from '../../domain/document';
import { generateId } from '../shared/generateId';

export interface UploadDocumentInput {
  source: DocumentSource;
  signal?: AbortSignal;
}

export class UploadDocumentUseCase {
  constructor(
    private readonly repository: DocumentRepositoryPort,
    private readonly processor: DocumentProcessorPort,
  ) {}

  async execute(input: UploadDocumentInput): Promise<string> {
    const id = generateId();
    let doc = createDocument(id, input.source);

    doc = updateDocumentStatus(doc, 'queued');
    this.repository.save(doc);

    doc = updateDocumentStatus(doc, 'processing');
    this.repository.save(doc);

    try {
      const result = await this.processor.process({
        source: input.source,
        signal: input.signal,
      });

      doc = updateDocumentExtraction(doc, result.extraction, result.previewUrl);
      this.repository.save(doc);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Processing failed';
      doc = updateDocumentStatus(doc, 'failed', message);
      this.repository.save(doc);
    }

    return id;
  }
}
