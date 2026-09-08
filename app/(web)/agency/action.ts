// lib/getStores.ts
import stores from './store.json';
import { Store } from '@/types/store';

export async function getStores(): Promise<Store[]> {
  // Later: replace this body with a Sanity client.fetch(query)
  return stores as Store[];
}
