import * as React from "react";
import { getClassName } from "../../helpers/getClassName";
import { classNames } from "../../lib/classNames";
import { Locale, subMonths, addMonths } from "date-fns";
import ru from "date-fns/locale/ru";
import { CalendarHeader } from "../CalendarHeader/CalendarHeader";
import { usePlatform } from "../../hooks/usePlatform";
import { CalendarDays } from "../CalendarDays/CalendarDays";
import { CalendarTime } from "../CalendarTime/CalendarTime";
import "./Calendar.css";

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date;
  /**
    Объект локализации из date-fns
   */
  locale?: Locale;
  disablePast?: boolean;
  disableFuture?: boolean;
  enableTime?: boolean;
  onChange?(value?: Date): void;
  shouldDisableDate?(value: Date): boolean;
  onClose?(): void;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onChange,
      locale = ru,
      disablePast,
      disableFuture,
      shouldDisableDate,
      onClose,
      enableTime = false,
      ...props
    },
    ref
  ) => {
    const [viewDate, setViewDate] = React.useState(value ?? new Date());
    const platform = usePlatform();

    const setPrevMonth = React.useCallback(
      () => setViewDate(subMonths(viewDate, 1)),
      [viewDate]
    );
    const setNextMonth = React.useCallback(
      () => setViewDate(addMonths(viewDate, 1)),
      [viewDate]
    );

    return (
      <div
        {...props}
        ref={ref}
        vkuiClass={classNames(getClassName("Calendar", platform))}
      >
        <CalendarHeader
          locale={locale}
          viewDate={viewDate}
          onChange={setViewDate}
          onNextMonth={setNextMonth}
          onPrevMonth={setPrevMonth}
        />
        <CalendarDays
          locale={locale}
          viewDate={viewDate}
          value={value}
          onChange={onChange}
          disablePast={disablePast}
          disableFuture={disableFuture}
          shouldDisableDate={shouldDisableDate}
        />
        {enableTime && value && (
          <div vkuiClass="Calendar__time">
            <CalendarTime value={value} onChange={onChange} onClose={onClose} />
          </div>
        )}
      </div>
    );
  }
);

Calendar.displayName = "Calendar";
