"use client";

import { Head } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Carousel,
  CarouselButton,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import type { SiteLayoutShellData } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";

interface StaffMember {
  id: number;
  name: string;
  position: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
}

interface PublicUnitPageProps extends SharedData {
  unit: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  };
  staff: StaffMember[];
  layout:
    | (SiteLayoutShellData & { id: number; key: string; name: string })
    | null;
}

export default function PublicUnitPage({
  unit,
  staff,
  layout,
}: PublicUnitPageProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const handleSetApi = useCallback((newApi: CarouselApi) => {
    setApi(newApi);
    if (!newApi) {
      return;
    }

    const onSelect = () => {
      setSelectedIndex(newApi.selectedScrollSnap());
    };

    setScrollSnaps(newApi.scrollSnapList());
    onSelect();

    newApi.on("select", onSelect);
    newApi.on("reInit", () => {
      setScrollSnaps(newApi.scrollSnapList());
      onSelect();
    });
  }, []);

  return (
    <>
      <Head>
        <title>{unit.name}</title>
        <meta
          name="description"
          content={`Thông tin chi tiết và nhân sự của ${unit.name} - Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam`}
        />
      </Head>

      <SiteLayoutShell layout={layout}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <Breadcrumbs className="select-none">
            <BreadcrumbsItem href="/">Trang chủ</BreadcrumbsItem>
            <BreadcrumbsItem className="font-semibold text-fg">
              {unit.name}
            </BreadcrumbsItem>
          </Breadcrumbs>

          {/* Heading */}
          <div className="relative pb-4">
            <Heading
              level={1}
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-fg"
            >
              {unit.name}
            </Heading>
            <div className="mt-3 h-1 w-16 bg-primary rounded-full" />
          </div>

          {/* Description Block */}
          {unit.description ? (
            <div className="rounded-3xl border border-border/50 bg-muted/15 p-6 md:p-8">
              <BlockNoteReadonly
                content={unit.description}
                className="!bg-transparent [&_.bn-editor]:!py-0 [&_.bn-editor]:!px-0 [&_.bn-root]:!bg-transparent [&_.bn-editor]:!bg-transparent text-sm md:text-base leading-relaxed text-fg"
              />
            </div>
          ) : null}

          {/* Staff Section */}
          <div className="space-y-6 pt-4">
            <div className="relative pb-2">
              <div className="flex items-center gap-2">
                <UsersIcon className="size-6 text-primary" />
                <Heading
                  level={2}
                  className="text-lg md:text-xl font-bold uppercase tracking-tight text-fg"
                >
                  Nhân sự
                </Heading>
              </div>
              <div className="mt-2 h-0.5 w-12 bg-primary rounded-full" />
            </div>

            {staff.length > 0 ? (
              <Carousel
                opts={{ align: "start", loop: false }}
                setApi={handleSetApi}
                className="w-full"
              >
                <div className="relative flex items-center justify-between gap-4">
                  {/* Previous Button */}
                  <CarouselButton
                    segment="previous"
                    className={twJoin(
                      "shrink-0 z-10 size-10 md:size-11 border border-border bg-bg hover:bg-muted text-fg transition-all shadow-xs",
                      scrollSnaps.length <= 1 ? "hidden" : ""
                    )}
                  />

                  {/* Viewport */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <CarouselContent className="-ms-4">
                      {staff.map((member) => (
                        <CarouselItem
                          key={member.id}
                          className="basis-full sm:basis-1/2 lg:basis-1/4 ps-4 py-2"
                        >
                          <div className="flex flex-col items-center text-center p-6 bg-overlay border border-border/60 rounded-2xl hover:shadow-md hover:border-primary/15 transition duration-300 h-full select-none group w-full">
                            {/* Circular Avatar */}
                            <div className="size-24 md:size-28 rounded-full overflow-hidden border border-border/70 mb-4 bg-muted/30 flex items-center justify-center text-muted-fg/60 shrink-0 shadow-xs group-hover:scale-105 transition duration-300">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.name}
                                  className="size-full object-cover object-center"
                                />
                              ) : (
                                <UserIcon className="size-16" />
                              )}
                            </div>

                            {/* Name */}
                            <Heading
                              level={3}
                              className="text-base font-bold text-fg group-hover:text-primary transition-colors tracking-tight leading-snug mb-1"
                            >
                              {member.name}
                            </Heading>

                            {/* Position */}
                            <Text className="text-xs font-semibold text-muted-fg mb-4">
                              {member.position}
                            </Text>

                            {/* Contact Details */}
                            <div className="space-y-1.5 text-xs text-muted-fg mt-auto w-full border-t border-border/40 pt-3 flex flex-col items-center">
                              {member.email && (
                                <div className="flex items-center justify-center gap-1.5 max-w-full">
                                  <EnvelopeIcon className="size-3.5 shrink-0 text-primary" />
                                  <span className="truncate max-w-[180px]">
                                    {member.email}
                                  </span>
                                </div>
                              )}
                              {member.phone && (
                                <div className="flex items-center justify-center gap-1.5 max-w-full">
                                  <PhoneIcon className="size-3.5 shrink-0 text-primary" />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </div>

                  {/* Next Button */}
                  <CarouselButton
                    segment="next"
                    className={twJoin(
                      "shrink-0 z-10 size-10 md:size-11 border border-border bg-bg hover:bg-muted text-fg transition-all shadow-xs",
                      scrollSnaps.length <= 1 ? "hidden" : ""
                    )}
                  />
                </div>

                {/* Dot Indicators */}
                {scrollSnaps.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-6">
                    {scrollSnaps.map((_, index) => (
                      <button
                        key={index}
                        className={twJoin(
                          "size-2 rounded-full transition-all duration-200 cursor-pointer",
                          index === selectedIndex
                            ? "bg-primary w-4"
                            : "bg-muted-fg/20 hover:bg-muted-fg/40"
                        )}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </Carousel>
            ) : (
              <div className="py-12 text-center rounded-2xl border border-dashed border-border/60 bg-muted/5 text-muted-fg">
                Không có hồ sơ nhân sự nào để hiển thị.
              </div>
            )}
          </div>
        </div>
      </SiteLayoutShell>
    </>
  );
}
