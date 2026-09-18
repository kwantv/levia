'use client';

import { Agency } from '@/app/(web)/agency/[slug]/action';
import InteractiveMap from '@/components/map/interactive-map';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/mapbox';
import GeolocateButton from './map/geolocate-control';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/sanity/lib/image';
import Image from 'next/image';

const ALL_PROVINCES = 'all';

export function AgencyLocator({ agencies }: { agencies: Agency[] }) {
  const mapRef = useRef<MapRef>(null);

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

  function handleProvinceChange(value: string) {
    setProvince(value);
    setSelectedAgencyId(undefined);
  }

  return (
    <div className="grid-layout mx-auto container">
      <div className="z-1 relative lg:col-span-4">
        <div className="top-16 z-30 sticky bg-background">
          {/* Search */}
          <div className="flex items-center gap-2 pt-4">
            <div className="relative grow">
              <Search className="top-1/2 left-4 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedAgencyId(undefined);
                }}
                placeholder="Tìm đại lý, địa chỉ..."
                className="bg-background pr-4 pl-12 border border-border focus:border-primary outline-none w-full h-14 text-foreground placeholder:text-muted-foreground text-sm transition-colors"
              />
            </div>

            <div className="shrink-0">
              <GeolocateButton mapRef={mapRef} />
            </div>
          </div>

          {/* Province filters */}
          <div className="relative mt-5">
            <div className="[&::-webkit-scrollbar]:hidden flex gap-2 overflow-x-auto [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => handleProvinceChange(ALL_PROVINCES)}
                className={cn(
                  'px-5 border h-10 text-sm transition-colors shrink-0',
                  province === ALL_PROVINCES
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                )}
              >
                Tất cả
              </button>

              {provinces.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleProvinceChange(item)}
                  className={cn(
                    'px-5 border h-10 text-sm transition-colors shrink-0',
                    province === item
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Fade at right side of horizontal filters */}
            <div className="top-0 right-0 absolute bg-linear-to-l from-background to-transparent w-12 h-full pointer-events-none" />
          </div>

          {/* Count */}
          <div className="flex items-center gap-1.5 pt-5 pb-5 text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">
              {filteredAgencies.length}
            </span>
            <span>đại lý</span>
          </div>

          {/* Soft bottom fade instead of a hard border */}
          <div className="top-full right-0 left-0 absolute bg-linear-to-b from-background to-transparent h-8 pointer-events-none" />
        </div>

        {filteredAgencies.length > 0 ? (
          <div>
            {filteredAgencies.map((agency) => {
              const isSelected = agency._id === selectedAgencyId;

              const thumb = agency.photos?.[0]
                ? getImageUrl(agency.photos[0])
                : undefined;

              return (
                <button
                  key={agency._id}
                  type="button"
                  onClick={() => setSelectedAgencyId(agency._id)}
                  className={cn(
                    'flex gap-6 py-6 border-b w-full text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'border-primary'
                      : 'border-border hover:border-foreground/30',
                  )}
                >
                  <div className="relative bg-muted/30 w-32 aspect-4/3 overflow-hidden shrink-0">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={agency.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center gap-2 h-full text-muted-foreground">
                        <span className="font-medium text-primary text-xs">
                          [ảnh]
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 grow">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg line-clamp-2">
                        {agency.name}
                      </CardTitle>

                      <Link
                        href={`/agency/${agency.slug}`}
                        onClick={(event) => event.stopPropagation()}
                        className={cn(
                          buttonVariants({
                            variant: 'ghost',
                            size: 'icon',
                          }),
                          'shrink-0',
                        )}
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>

                    <p className="flex items-start gap-2 mt-2 text-muted-foreground text-sm">
                      <MapPin className="mt-0.5 size-4 text-primary shrink-0" />
                      <span>
                        {agency.address}, {agency.province}
                      </span>
                    </p>

                    {agency.hours && (
                      <p className="flex items-start gap-2 mt-2 text-muted-foreground text-sm">
                        <Clock className="mt-0.5 size-4 text-primary shrink-0" />
                        <span>{agency.hours}</span>
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-muted/30 mt-6 p-8 border border-border text-center">
            <MapPin className="mx-auto size-6 text-primary" />

            <h2 className="mt-4 font-heading text-xl">Không tìm thấy đại lý</h2>

            <p className="mt-2 text-muted-foreground text-sm">
              Thử thay đổi từ khóa hoặc chọn khu vực khác.
            </p>
          </div>
        )}
      </div>

      <div className="lg:col-span-8 lg:-ml-20">
        <div className="lg:top-0 lg:sticky h-dvh min-h-175">
          <div className="isolate absolute inset-0">
            <InteractiveMap
              mapRef={mapRef}
              agencies={filteredAgencies}
              selectedAgencyId={selectedAgencyId}
              onAgencySelect={setSelectedAgencyId}
            />
            <div className="z-1 absolute inset-0 mask-map" />
          </div>
          <div className="right-24 bottom-24 absolute font-mono text-muted-foreground text-right uppercase tracking-wider">
            <span>scroll</span>
            <br />
            <span>to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
