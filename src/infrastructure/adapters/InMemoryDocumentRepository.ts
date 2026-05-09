import type { DocumentRepositoryPort } from '../../domain/document/DocumentRepository.port';
import type { Document, DocumentId } from '../../domain/document';

export class InMemoryDocumentRepository implements DocumentRepositoryPort {
  private readonly store = new Map<DocumentId, Document>();

  findAll(): Document[] {
    return Array.from(this.store.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  findById(id: DocumentId): Document | undefined {
    return this.store.get(id);
  }

  save(document: Document): void {
    this.store.set(document.id, document);
  }

  remove(id: DocumentId): void {
    this.store.delete(id);
  }
}
