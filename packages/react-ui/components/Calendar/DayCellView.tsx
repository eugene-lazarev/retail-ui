import React, { useContext } from 'react';

import { useLocaleForControl } from '../../lib/locale/useLocaleForControl';
import { Nullable } from '../../typings/utility-types';
import { ThemeContext } from '../../lib/theming/ThemeContext';
import { cx } from '../../lib/theming/Emotion';
import { isTheme2022 } from '../../lib/theming/ThemeHelpers';
import { DatePickerLocaleHelper } from '../DatePicker/locale';
import { InternalDate } from '../../lib/date/InternalDate';
import { LocaleContext } from '../../lib/locale';

import * as CDS from './CalendarDateShape';
import { globalClasses, styles } from './DayCellView.styles';
import { CalendarDataTids } from './Calendar';

interface DayCellViewProps {
  date: CDS.CalendarDateShape;
  today?: CDS.CalendarDateShape;
  value?: Nullable<CDS.CalendarDateShape>;
  minDate?: CDS.CalendarDateShape;
  maxDate?: CDS.CalendarDateShape;
  onDateClick?: (day: CDS.CalendarDateShape) => void;
  isWeekend?: boolean;
  renderItem: (date: CDS.CalendarDateShape) => React.ReactNode | number;
}

export function DayCellView(props: DayCellViewProps) {
  const { date, minDate, maxDate, today, value, isWeekend, onDateClick, renderItem } = props;
  const theme = useContext(ThemeContext);
  const _isTheme2022 = isTheme2022(theme);

  const handleClick = () => {
    const { date, month, year } = props.date;
    onDateClick?.({ date, month, year });
  };

  const child = _isTheme2022 ? (
    <span className={cx(globalClasses.todayCaption, styles.todayCaption())}>{renderItem(date)}</span>
  ) : (
    renderItem(date)
  );

  const isToday = Boolean(today && CDS.isEqual(date, today));

  const locale = useLocaleForControl('Calendar', DatePickerLocaleHelper);
  const { langCode } = useContext(LocaleContext);
  const ariaLabel = `${locale.dayCellChooseDateAriaLabel}: ${new InternalDate({ langCode })
    .setComponents({ ...date }, true)
    .toA11YFormat()}`;

  return (
    <button
      data-tid={CalendarDataTids.dayCell}
      tabIndex={-1}
      aria-label={ariaLabel}
      disabled={!CDS.isBetween(date, minDate, maxDate)}
      className={cx({
        [styles.baseCell(theme)]: true,
        [styles.dayCell(theme)]: true,
        [styles.today(theme)]: isToday && !_isTheme2022,
        [styles.today2022(theme)]: isToday && _isTheme2022,
        [styles.selected(theme)]: Boolean(value && CDS.isEqual(date, value)),
        [styles.weekend(theme)]: Boolean(isWeekend),
      })}
      onClick={handleClick}
    >
      {child}
    </button>
  );
}
