import { Tab } from '@headlessui/react';
import { ClockIcon, TicketIcon } from '@heroicons/react/24/solid';

/**
 * BottomNavTabs — sticky bottom navigation bar for mobile screens.
 *
 * Renders two tabs ("Drawings" and "Tickets") using @headlessui/react Tab
 * components. Hidden on desktop (≥768px) where split-view layout is used.
 *
 * @example
 * <BottomNavTabs onChange={(idx) => console.log('Tab changed to', idx)} />
 *
 * @param {object} props
 * @param {(index: number) => void} [props.onChange] — Callback fired when the active tab changes; receives the new index (0 or 1).
 */
export default function BottomNavTabs({ onChange }) {
  return (
    <Tab.Group defaultIndex={0} onChange={(idx) => onChange?.(idx)}>
      <Tab.List className="fixed bottom-0 left-0 right-0 z-50 flex h-14 flex-row items-center justify-around bg-white border-t border-gray-200 md:hidden" style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
        <Tab className={({ selected }) => `relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer transition-colors duration-150 ${selected ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>{({ selected }) => (
          <>
            {selected && (
              <span className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-b-full bg-[var(--color-primary)]" />
            )}
            <ClockIcon className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold leading-none">Drawings</span>
          </>
        )}</Tab>
        <Tab className={({ selected }) => `relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer transition-colors duration-150 ${selected ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>{({ selected }) => (
          <>
            {selected && (
              <span className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-b-full bg-[var(--color-primary)]" />
            )}
            <TicketIcon className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold leading-none">Tickets</span>
          </>
        )}</Tab>
      </Tab.List>
    </Tab.Group>
  );
}
