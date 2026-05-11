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

const activeControllers = new Map<DocumentId, AbortController>();
const objectUrls = new Map<DocumentId, string>();

interface DocumentStoreState {
  documents: Document[];
  selectedId: DocumentId | null;
  processingCount: number;

  selectDocument: (id: DocumentId | null) => void;
  uploadFile: (file: File) => Promise<void>;
  uploadUrl: (url: string) => Promise<void>;
  removeDocument: (id: DocumentId) => void;
  validateField: (docId: DocumentId, fieldKey: string) => void;
}

function sync(set: (partial: Partial<DocumentStoreState>) => void) {
  const docs = repository.findAll();
  const processing = docs.filter(d => d.status === 'processing' || d.status === 'queued').length;
  set({ documents: docs, processingCount: processing });
}

function detectMimeFromUrl(url: string): string {
  const clean = (url.split('?')[0] ?? '').toLowerCase();
  if (clean.endsWith('.pdf')) return 'application/pdf';
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
  documents: [],
  selectedId: null,
  processingCount: 0,

  selectDocument: (id) => set({ selectedId: id }),

  uploadFile: async (file: File) => {
    validateFileMimeType(file.type);

    const id = generateId();
    const objectUrl = URL.createObjectURL(file);
    objectUrls.set(id, objectUrl);

    const controller = new AbortController();
    activeControllers.set(id, controller);

    let doc = createDocument(id, {
      type: 'file',
      value: objectUrl,
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });
    doc = updateDocumentStatus(doc, 'queued');
    repository.save(doc);
    set({ documents: repository.findAll(), selectedId: id, processingCount: get().processingCount + 1 });

    doc = updateDocumentStatus(doc, 'processing');
    repository.save(doc);
    sync(set);

    try {
      const base64 = await fileToBase64(file);
      const sourceWithBase64 = { ...doc.source, base64 };
      const result = await processor.process({ source: sourceWithBase64, signal: controller.signal });
      doc = updateDocumentExtraction(doc, result.extraction, result.previewUrl);
      repository.save(doc);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Processing failed';
      doc = updateDocumentStatus(doc, 'failed', message);
      repository.save(doc);
    } finally {
      activeControllers.delete(id);
    }

    sync(set);
  },

  uploadUrl: async (url: string) => {
    const sanitized = sanitizeUrl(url);
    const name = sanitized.split('/').pop()?.split('?')[0] ?? 'document';
    const mimeType = detectMimeFromUrl(sanitized);
    const id = generateId();

    const controller = new AbortController();
    activeControllers.set(id, controller);

    let doc = createDocument(id, { type: 'url', value: sanitized, name, mimeType });
    doc = updateDocumentStatus(doc, 'queued');
    repository.save(doc);
    set({ documents: repository.findAll(), selectedId: id, processingCount: get().processingCount + 1 });

    doc = updateDocumentStatus(doc, 'processing');
    repository.save(doc);
    sync(set);

    try {
      const result = await processor.process({ source: doc.source, signal: controller.signal });
      doc = updateDocumentExtraction(doc, result.extraction, result.previewUrl);
      repository.save(doc);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Processing failed';
      doc = updateDocumentStatus(doc, 'failed', message);
      repository.save(doc);
    } finally {
      activeControllers.delete(id);
    }

    sync(set);
  },

  removeDocument: (id: DocumentId) => {
    activeControllers.get(id)?.abort();
    activeControllers.delete(id);

    const objectUrl = objectUrls.get(id);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrls.delete(id);
    }

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
