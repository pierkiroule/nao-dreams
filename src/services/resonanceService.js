import { templateFor } from "../data/resonanceTemplates";
export async function generateResonance(fingerprint) { const template = templateFor(fingerprint.movement); return { id: crypto.randomUUID(), fingerprintId: fingerprint.id, title: template.title, text: template.body, finalSentence: template.final, createdAt: new Date().toISOString() }; }
