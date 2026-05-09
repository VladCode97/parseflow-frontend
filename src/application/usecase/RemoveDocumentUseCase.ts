import type { DocumentRepositoryPort } from '../../domain/document/DocumentRepository.port';
import type { DocumentId } from '../../domain/document';

export class RemoveDocumentUseCase {
  constructor(private readonly repository: DocumentRepositoryPort) {}

  execute(id: DocumentId): void {
    this.repository.remove(id);
  }
}
