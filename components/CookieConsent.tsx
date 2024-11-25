// app/components/CookieConsent.tsx

"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline,
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className={cn(
          "fixed bottom-4 left-1/2 transform -translate-x-1/2",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
          "shadow-lg rounded-lg p-4 max-w-md w-full",
          "flex flex-col sm:flex-row items-center gap-4"
        )}
      >
        <div className="flex-1">
          <Toast.Title className="font-medium text-lg">
            Používame cookies
          </Toast.Title>
          <Toast.Description className="mt-1 text-sm">
            Tento web používa cookies na zlepšenie vášho zážitku. Môžete prijať
            alebo odmietnuť sledovacie cookies.
          </Toast.Description>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onDecline();
              setOpen(false);
            }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Odmietnuť
          </button>
          <button
            onClick={() => {
              onAccept();
              setOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Prijať
          </button>
        </div>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
};
