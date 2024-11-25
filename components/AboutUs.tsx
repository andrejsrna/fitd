// app/components/AboutUs.tsx

"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button"; // Predpokladám, že máte komponent Button
import Link from "next/link";

export const AboutUs: React.FC = () => {
  return (
    <section className="py-16 bg-green-100 dark:bg-gray-900">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-grey-600 mb-4">
            <Balancer>
              O nás
            </Balancer>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            V našich produktoch sa spája sila prírody a moderná veda, aby ste mohli podporiť svoje zdravie bezpečne a efektívne.
          </p>
        </div>

        {/* Accordion komponent */}
        <Accordion.Root type="single" collapsible className="space-y-6">
          <Accordion.Item value="item-1" className="border-b border-gray-200 pb-4">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full text-left text-xl font-medium text-gray-800 dark:text-white">
                Naše poslanie
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.44l3.71-4.21a.75.75 0 111.14.98l-4.25 4.82a.75.75 0 01-1.14 0L5.21 8.25a.75.75 0 01.02-1.06z" />
                </svg>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="mt-4 text-gray-600 dark:text-gray-300">
              <p>
                V <span className="font-semibold">FitDoplnky.sk</span> je naším poslaním podporovať vaše zdravie a pohodu prostredníctvom kvalitných doplnkov výživy a hodnotných informácií. Veríme, že každý má právo na zdravý a aktívny životný štýl.
              </p>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-2" className="border-b border-gray-200 pb-4">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full text-left text-xl font-medium text-gray-800 dark:text-white">
                Najsilnejšia kĺbová výživa
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.44l3.71-4.21a.75.75 0 111.14.98l-4.25 4.82a.75.75 0 01-1.14 0L5.21 8.25a.75.75 0 01.02-1.06z" />
                </svg>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="mt-4 text-gray-600 dark:text-gray-300">
              <p>
                Predstavujeme vám našu <span className="font-semibold">Najsilnejšiu kĺbovú výživu</span>, špeciálne vyvinutú na podporu zdravia vašich kĺbov. Naša receptúra kombinuje prírodné zložky s najnovšími vedeckými poznatkami pre maximálnu účinnosť.
              </p>
              <div className="mt-4">
                <Button asChild className="bg-green-600 text-white hover:bg-green-700">
                  <Link href="https://najsilnejsiaklbovavyziva.sk/">
                    Viac o produkte
                  </Link>
                </Button>
              </div>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-3" className="border-b border-gray-200 pb-4">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full text-left text-xl font-medium text-gray-800 dark:text-white">
                Náš blog o zdraví
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.44l3.71-4.21a.75.75 0 111.14.98l-4.25 4.82a.75.75 0 01-1.14 0L5.21 8.25a.75.75 0 01.02-1.06z" />
                </svg>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="mt-4 text-gray-600 dark:text-gray-300">
              <p>
                Navštívte náš blog, kde pravidelne zdieľame tipy, rady a informácie o zdraví, výžive a aktívnom životnom štýle. Naším cieľom je poskytnúť vám inšpiráciu a vedomosti pre lepší život.
              </p>
              <div className="mt-4">
                <Button asChild className="bg-green-600 text-white hover:bg-green-700">
                  <Link href="/clanky">
                    Prejsť na blog
                  </Link>
                </Button>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </section>
  );
};
