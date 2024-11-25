// app/components/CookieConsent.tsx

"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline,
}) => {
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        {/* Priehľadné pozadie */}
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />

        {/* Obsah modálneho okna */}
        <Dialog.Content
          className={cn(
            "fixed z-50",
            "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "shadow-lg rounded-lg p-6 max-w-md w-full"
          )}
        >
          <Dialog.Title className="font-semibold text-xl text-center">
            Používame cookies
          </Dialog.Title>
          <Dialog.Description className="mt-4 text-sm text-center">
            Tento web používa cookies na zlepšenie vášho zážitku. Môžete prijať
            alebo odmietnuť sledovacie cookies.
          </Dialog.Description>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => {
                onDecline();
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Odmietnuť
            </button>
            <button
              onClick={() => {
                onAccept();
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent-700"
            >
              Prijať
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};