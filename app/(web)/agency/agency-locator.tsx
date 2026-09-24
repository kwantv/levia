'use client';

import type { Agency } from '@/app/(web)/agency/[slug]/action';
import InteractiveMap from '@/components/map/interactive-map';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/sanity/lib/image';
import { ArrowUpRight, Clock, MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

const ALL_PROVINCES = 'all';

export function AgencyLocator({ agencies }: { agencies: Agency[] }) {
  const mapRef = useRef<MapRef>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [province, setProvince] = useState(ALL_PROVINCES);

  const [search, setSearch] = useState('');

  const [selectedAgencyId, setSelectedAgencyId] = useState<string>();

  const provinces = useMemo(
    () => [...new Set(agencies.map((agency) => agency.province))].sort(),
    [agencies],
  );

  const filteredAgencies = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('vi');

    return agencies.filter((agency) => {
      const matchesProvince =
        province === ALL_PROVINCES || agency.province === province;

      const matchesSearch =
        !query ||
        agency.name.toLocaleLowerCase('vi').includes(query) ||
        agency.address.toLocaleLowerCase('vi').includes(query) ||
        agency.province.toLocaleLowerCase('vi').includes(query);

      return matchesProvince && matchesSearch;
    });
  }, [agencies, province, search]);

  /**
   * Reset only the internal list scroll.
   *
   * The page itself never moves because the locator
   * keeps a stable height.
   */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [search, province]);

  function handleProvinceChange(value: string) {
    setProvince(value);
    setSelectedAgencyId(undefined);
  }

  return (
    <section className="border-border border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 container">
        <div className="lg:grid lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] border border-border lg:h-[calc(100svh-6rem)] lg:min-h-[680px] lg:max-h-[900px]">
          {/* ───────── LIST PANEL ───────── */}

          <div className="flex flex-col bg-background lg:border-border lg:border-r min-h-0">
            <AgencyFilters
              search={search}
              province={province}
              provinces={provinces}
              count={filteredAgencies.length}
              onSearchChange={(value) => {
                setSearch(value);
                setSelectedAgencyId(undefined);
              }}
              onProvinceChange={handleProvinceChange}
            />

            {/* Desktop results */}
            <div
              ref={listRef}
              className="hidden lg:block flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin"
            >
              <AgencyResults
                agencies={filteredAgencies}
                selectedAgencyId={selectedAgencyId}
                onSelect={setSelectedAgencyId}
              />
            </div>
          </div>

          {/* ───────── MAP ───────── */}

          <div className="relative bg-card h-[440px] sm:h-[520px] lg:h-full min-h-0">
            <InteractiveMap
              mapRef={mapRef}
              agencies={filteredAgencies}
              selectedAgencyId={selectedAgencyId}
              onAgencySelect={setSelectedAgencyId}
            />
          </div>

          {/* ───────── MOBILE RESULTS ───────── */}

          <div
            ref={listRef}
            className="lg:hidden bg-background border-border border-t h-[min(65svh,620px)] min-h-[420px] overflow-y-auto overscroll-contain"
          >
            <AgencyResults
              agencies={filteredAgencies}
              selectedAgencyId={selectedAgencyId}
              onSelect={setSelectedAgencyId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AgencyFilters({
  search,
  province,
  provinces,
  count,
  onSearchChange,
  onProvinceChange,
}: {
  search: string;
  province: string;
  provinces: string[];
  count: number;
  onSearchChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
}) {
  return (
    <div className="bg-background p-5 sm:p-6 border-border border-b shrink-0">
      <div className="flex justify-between items-end gap-4 mb-5">
        <div>
          <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.2em]">
            Store locator
          </span>

          <p className="mt-2 text-sm">
            <span className="font-medium text-foreground">
              {filteredNumber(count)}
            </span>{' '}
            <span className="text-muted-foreground">đại lý</span>
          </p>
        </div>

        <span className="bg-primary size-1.5" />
      </div>

      <div className="space-y-2">
        {/* Search */}
        <label className="block relative">
          <Search className="top-1/2 left-4 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tên hoặc địa chỉ đại lý..."
            className="bg-background pr-4 pl-11 border border-border focus:border-primary outline-none w-full h-13 placeholder:text-muted-foreground text-sm transition-colors"
          />
        </label>

        {/* Province */}
        <label className="block">
          <span className="sr-only">Tỉnh / thành</span>

          <select
            value={province}
            onChange={(event) => onProvinceChange(event.target.value)}
            className="bg-background px-4 border border-border focus:border-primary outline-none w-full h-13 text-foreground text-sm transition-colors cursor-pointer"
          >
            <option value={ALL_PROVINCES}>Tất cả tỉnh / thành</option>

            {provinces.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function filteredNumber(value: number) {
  return String(value).padStart(2, '0');
}

function AgencyResults({
  agencies,
  selectedAgencyId,
  onSelect,
}: {
  agencies: Agency[];
  selectedAgencyId?: string;
  onSelect: (agencyId: string) => void;
}) {
  if (agencies.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-8 h-full min-h-72 text-center">
        <MapPin className="size-6 text-primary" />

        <h2 className="mt-5 font-heading font-medium text-xl tracking-[-0.025em]">
          Không tìm thấy đại lý
        </h2>

        <p className="mt-2 max-w-sm text-muted-foreground text-sm leading-relaxed">
          Thử thay đổi từ khóa hoặc chọn khu vực khác.
        </p>
      </div>
    );
  }

  return (
    <div>
      {agencies.map((agency, index) => (
        <AgencyRow
          key={agency._id}
          agency={agency}
          index={index}
          selected={agency._id === selectedAgencyId}
          onSelect={() => onSelect(agency._id)}
        />
      ))}
    </div>
  );
}

function AgencyRow({
  agency,
  index,
  selected,
  onSelect,
}: {
  agency: Agency;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const thumb = agency.photos?.[0]
    ? getImageUrl(agency.photos[0], 400)
    : undefined;

  return (
    <article
      className={cn(
        'group relative border-b transition-colors',
        selected
          ? 'border-primary bg-primary/[0.025]'
          : 'border-border hover:bg-card/30',
      )}
    >
      {/* Map selection button */}
      <button
        type="button"
        aria-label={`Hiển thị ${agency.name} trên bản đồ`}
        onClick={onSelect}
        className="z-0 absolute inset-0"
      />

      <div className="z-10 relative gap-4 grid grid-cols-[6rem_minmax(0,1fr)] p-5 pointer-events-none">
        <div className="relative bg-card aspect-[4/3] overflow-hidden">
          {thumb ? (
            <Image
              src={thumb}
              alt={agency.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              sizes="96px"
            />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center">
              <MapPin className="size-5 text-primary/60" />
            </div>
          )}

          <span className="top-2 left-2 absolute bg-background/80 backdrop-blur-sm px-1.5 py-1 font-mono text-[8px] text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="font-mono text-[8px] text-primary uppercase tracking-[0.15em]">
                {agency.province}
              </span>

              <h3 className="mt-1.5 font-heading font-medium text-base sm:text-lg leading-tight tracking-[-0.02em]">
                {agency.name}
              </h3>
            </div>

            <Link
              href={`/agency/${agency.slug}`}
              aria-label={`Xem chi tiết ${agency.name}`}
              className="flex justify-center items-center hover:bg-primary border border-border hover:border-primary size-9 text-muted-foreground hover:text-primary-foreground transition-all pointer-events-auto shrink-0"
            >
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <p className="flex items-start gap-2 mt-3 text-muted-foreground text-xs leading-relaxed">
            <MapPin className="mt-0.5 size-3.5 text-primary shrink-0" />

            <span>{agency.address}</span>
          </p>

          {agency.hours && (
            <p className="flex items-center gap-2 mt-2 font-mono text-[8px] text-muted-foreground uppercase tracking-[0.1em]">
              <Clock className="size-3 text-primary" />

              {agency.hours}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
