import type { Work, Author, CurrentUser, InventoryItem } from '../types';

const KEYS = {
  works: 'craft_works',
  authors: 'craft_authors',
  user: 'craft_current_user',
  inventory: 'craft_inventory',
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/* Works */
export function getWorks(): Work[] {
  return read<Work[]>(KEYS.works) || [];
}

export function saveWorks(works: Work[]): void {
  write(KEYS.works, works);
}

export function getWorkById(id: string): Work | undefined {
  return getWorks().find((w) => w.id === id);
}

export function addWork(work: Work): void {
  const works = getWorks();
  works.unshift(work);
  saveWorks(works);
}

export function updateWork(work: Work): void {
  const works = getWorks();
  const idx = works.findIndex((w) => w.id === work.id);
  if (idx !== -1) {
    works[idx] = work;
    saveWorks(works);
  }
}

/* Authors */
export function getAuthors(): Author[] {
  return read<Author[]>(KEYS.authors) || [];
}

export function saveAuthors(authors: Author[]): void {
  write(KEYS.authors, authors);
}

export function getAuthorById(id: string): Author | undefined {
  return getAuthors().find((a) => a.id === id);
}

export function updateAuthor(author: Author): void {
  const authors = getAuthors();
  const idx = authors.findIndex((a) => a.id === author.id);
  if (idx !== -1) {
    authors[idx] = author;
    saveAuthors(authors);
  }
}

/* Current User */
export function getCurrentUser(): CurrentUser | null {
  return read<CurrentUser>(KEYS.user);
}

export function setCurrentUser(user: CurrentUser): void {
  write(KEYS.user, user);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(KEYS.user);
}

/* Inventory */
export function getInventory(): InventoryItem[] {
  return read<InventoryItem[]>(KEYS.inventory) || [];
}

export function saveInventory(items: InventoryItem[]): void {
  write(KEYS.inventory, items);
}

export function addInventoryItem(item: InventoryItem): void {
  const items = getInventory();
  items.push(item);
  saveInventory(items);
}

export function removeInventoryItem(id: string): void {
  const items = getInventory().filter((i) => i.id !== id);
  saveInventory(items);
}

export function updateInventoryItem(updated: InventoryItem): void {
  const items = getInventory();
  const idx = items.findIndex((i) => i.id === updated.id);
  if (idx !== -1) {
    items[idx] = updated;
    saveInventory(items);
  }
}

export function isMaterialOwned(materialName: string): boolean {
  const items = getInventory();
  const lower = materialName.toLowerCase();
  return items.some((i) => lower.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(lower));
}
