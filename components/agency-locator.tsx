'use client';

import { Agency } from '@/app/(web)/agency/[slug]/action';
import InteractiveMap from '@/components/map/interactive-map';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const ALL_PROVINCES = 'all';

export function AgencyLocator({ agencies }: { agencies: Agency[] }) {
  const [province, setProvince] = useState(ALL_PROVINCES);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>();

  const provinces = useMemo(
    () => [...new Set(agencies.map((agency) => agency.province))].sort(),
    [agencies],
  );

  const filteredAgencies = useMemo(
    () =>
      province === ALL_PROVINCES
        ? agencies
        : agencies.filter((agency) => agency.province === province),
    [agencies, province],
  );

  function handleProvinceChange(value: string) {
    setProvince(value);
    setSelectedAgencyId(undefined);
  }

  return (
    <div className="gap-8 grid lg:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
      <div className="lg:top-20 lg:sticky h-fit">
        <div className="border border-border w-full aspect-square">
          <InteractiveMap
            agencies={filteredAgencies}
            selectedAgencyId={selectedAgencyId}
            onAgencySelect={setSelectedAgencyId}
          />
        </div>
      </div>

      <div>
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4 pb-6 border-border border-b">
          <div>
            <label
              htmlFor="province"
              className="block mb-2 font-medium text-foreground text-sm"
            >
              Tỉnh/thành
            </label>
            <select
              id="province"
              value={province}
              onChange={(event) => handleProvinceChange(event.target.value)}
              className="bg-background px-3 border border-input focus:border-ring outline-none focus:ring-1 focus:ring-ring/50 w-full sm:w-64 h-9 text-foreground text-sm"
            >
              <option value={ALL_PROVINCES}>Tất cả tỉnh/thành</option>
              {provinces.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">
              {filteredAgencies.length}
            </span>{' '}
            đại lý
          </p>
        </div>

        {filteredAgencies.length > 0 ? (
          <div className="gap-4 grid mt-6">
            {filteredAgencies.map((agency) => {
              const isSelected = agency._id === selectedAgencyId;

              return (
                <Card
                  key={agency._id}
                  className={isSelected ? 'ring-primary/60' : undefined}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-lg">{agency.name}</CardTitle>
                        <CardDescription className="mt-1 text-primary">
                          {agency.province}
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Xem ${agency.name} trên bản đồ`}
                        onClick={() => setSelectedAgencyId(agency._id)}
                      >
                        <MapPin className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="flex items-start gap-2 text-muted-foreground text-sm">
                      <MapPin className="mt-0.5 size-4 text-primary shrink-0" />
                      <span>{agency.address}</span>
                    </p>

                    {agency.hours && (
                      <p className="flex items-start gap-2 text-muted-foreground text-sm">
                        <Clock className="mt-0.5 size-4 text-primary shrink-0" />
                        <span>{agency.hours}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link href={`/agency/${agency.slug}`}>
                        <Button variant="outline">Xem chi tiết</Button>
                      </Link>

                      {agency.mapLink && (
                        <a
                          href={agency.mapLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button>
                            <Navigation className="size-4" />
                            Chỉ đường
                          </Button>
                        </a>
                      )}

                      {agency.phone && (
                        <a href={`tel:${agency.phone.replace(/\s/g, '')}`}>
                          <Button variant="outline">
                            <Phone className="size-4" />
                            {agency.phone}
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="bg-muted/30 mt-6 p-8 border border-border text-center">
            <MapPin className="mx-auto size-6 text-primary" />
            <h2 className="mt-4 font-heading text-xl">
              Chưa có đại lý tại khu vực này
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Hãy chọn tỉnh/thành khác để xem các điểm bán hiện có.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
