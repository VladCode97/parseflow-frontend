import type { Document, DocumentId } from './Document';

export interface DocumentRepositoryPort {
  findAll(): Document[];
  findById(id: DocumentId): Document | undefined;
  save(document: Document): void;
  remove(id: DocumentId): void;
}
