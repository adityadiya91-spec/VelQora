/**
 * Base44 Entity Adapter
 * Provides standard entity persistence abstraction.
 * Currently uses localStorage for local prototype, with API signatures
 * strictly matching Base44 entity CRUD operations for seamless future backend replacement.
 */

import { getStorage, setStorage } from "@/lib/storage";

const STORAGE_PREFIX = "velqora_b44_";

export async function listEntities(entityName) {
  const key = `${STORAGE_PREFIX}${entityName}`;
  const list = getStorage(key, []);
  return { data: list, total: list.length, status: "success" };
}

export async function createEntity(entityName, data) {
  const key = `${STORAGE_PREFIX}${entityName}`;
  const list = getStorage(key, []);
  const id = data.id || `ent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const record = { ...data, id, created_at: new Date().toISOString() };
  list.unshift(record);
  setStorage(key, list);
  return { data: record, status: "created" };
}

export async function updateEntity(entityName, id, updates) {
  const key = `${STORAGE_PREFIX}${entityName}`;
  const list = getStorage(key, []);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Entity ${entityName} with id ${id} not found.`);
  }
  const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
  list[index] = updated;
  setStorage(key, list);
  return { data: updated, status: "updated" };
}

export async function deleteEntity(entityName, id) {
  const key = `${STORAGE_PREFIX}${entityName}`;
  const list = getStorage(key, []);
  const filtered = list.filter((item) => item.id !== id);
  setStorage(key, filtered);
  return { id, status: "deleted" };
}

export default {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
};
