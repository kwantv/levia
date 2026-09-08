import { getStores } from './action';
import InteractiveMap from '@/components/map/interactive-map';

export default async function Page() {
  const stores = await getStores();
  return <InteractiveMap stores={stores} />;
}
