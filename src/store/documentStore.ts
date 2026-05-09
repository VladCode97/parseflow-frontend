import { create } from 'zustand';
import type { Document, DocumentId } from '../domain/document';
import {
  createDocument,
  updateDocumentStatus,
  updateDocumentExtraction,
} from '../domain/document';
import { InMemoryDocumentRepository } from '../infrastructure/adapters/InMemoryDocumentRepository';
import { ApiDocumentProcessor } from '../infrastructure/adapters/ApiDocumentProcessor';
import { RemoveDocumentUseCase } from '../application/usecase/RemoveDocumentUseCase';
import { sanitizeUrl, validateFileMimeType } from '../application/shared/sanitize';
import { generateId } from '../application/shared/generateId';
import { fileToBase64 } from '../application/shared/fileUtils';

const repository = new InMemoryDocumentRepository();
const processor = new ApiDocumentProcessor();
const removeUseCase = new RemoveDocumentUseCase(repository);

interface DocumentStoreState {
  documents: Document[];
  selectedId: DocumentId | null;

  selectDocument: (id: DocumentId | null) => void;
  uploadFile: (file: File) => Promise<void>;
  uploadUrl: (url: string) => Promise<void>;
  removeDocument: (id: DocumentId) => void;
  validateField: (docId: DocumentId, fieldKey: string) => void;
}

function sync(set: (partial: Partial<DocumentStoreState>) => void) {
  set({ documents: repository.findAll() });
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
  documents: [],
  selectedId: null,

  selectDocument: (id) => set({ selectedId: id }),

  uploadFile: async (file: File) => {
    validateFileMimeType(file.type);

    const id = generateId();
    const objectUrl = URL.createObjectURL(file);

    let doc = createDocument(id, {
      type: 'file',
      value: objectUrl,
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });
    doc = updateDocumentStatus(doc, 'queued');
    repository.save(doc);
    sync(set);
    if (!get().selectedId) set({ selectedId: id });

    doc = updateDocumentStatus(doc, 'processing');
    repository.save(doc);
    sync(set);

    try {
      const base64 = await fileToBase64(file);
      const sourceWithBase64 = { ...doc.source, base64 };
      const result = await processor.process({ source: sourceWithBase64 });
      doc = updateDocumentExtraction(doc, result.extraction, result.previewUrl);
      repository.save(doc);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Processing failed';
      doc = updateDocumentStatus(doc, 'failed', message);
      repository.save(doc);
    }

    sync(set);
  },

  uploadUrl: async (url: string) => {
    const sanitized = sanitizeUrl(url);
    const name = sanitized.split('/').pop()?.split('?')[0] ?? 'document';
    const id = generateId();

    let doc = createDocument(id, { type: 'url', value: sanitized, name, mimeType: 'image/jpeg' });
    doc = updateDocumentStatus(doc, 'queued');
    repository.save(doc);
    sync(set);
    if (!get().selectedId) set({ selectedId: id });

    doc = updateDocumentStatus(doc, 'processing');
    repository.save(doc);
    sync(set);

    try {
      const result = await processor.process({ source: doc.source });
      doc = updateDocumentExtraction(doc, result.extraction, result.previewUrl);
      repository.save(doc);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Processing failed';
      doc = updateDocumentStatus(doc, 'failed', message);
      repository.save(doc);
    }

    sync(set);
  },

  removeDocument: (id: DocumentId) => {
    removeUseCase.execute(id);
    sync(set);
    if (get().selectedId === id) {
      const remaining = repository.findAll();
      set({ selectedId: remaining[0]?.id ?? null });
    }
  },

  validateField: (docId: DocumentId, fieldKey: string) => {
    const doc = repository.findById(docId);
    if (!doc?.extraction) return;
    repository.save({
      ...doc,
      extraction: {
        ...doc.extraction,
        fields: doc.extraction.fields.map(f =>
          f.key === fieldKey ? { ...f, validated: !f.validated } : f,
        ),
      },
    });
    sync(set);
  },
}));
