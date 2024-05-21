import { css, memoizeStyle } from '../../lib/theming/Emotion';
import type { Emotion } from '@emotion/css/create-instance';

import { memoizeStyle, prefix } from '../../lib/theming/Emotion';
import { Theme } from '../../lib/theming/Theme';
import { resetButton } from '../../lib/styles/Mixins';

export const getStyles = (emotion: Emotion) =>
  memoizeStyle({
    cell(t: Theme) {
      return emotion.css`
        flex: 1 1 ${t.calendarCellWidth};
        height: ${t.calendarCellHeight};
    `;
  },
  day(t: Theme) {
    return css`
      width: 100%;
      height: 100%;

        background: ${t.calendarCellBg};
        border: 1px solid transparent;
        font-size: ${t.calendarCellFontSize};
        padding: 0;
        text-align: center;
        user-select: none;
        position: relative;
        line-height: ${t.calendarCellLineHeight};
        border-radius: ${t.calendarCellBorderRadius};

        &:hover {
          background-color: ${t.calendarCellHoverBgColor};
          color: ${t.calendarCellHoverColor};
          cursor: pointer;
        }
        &:disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        &:active:hover:enabled {
          color: ${t.calendarCellActiveHoverColor};
        }
      `;
    },

    selected(t: Theme) {
      return emotion.css`
        background-color: ${t.calendarCellSelectedBgColor};
        color: ${t.calendarCellSelectedFontColor};
      `;
    },

    weekend(t: Theme) {
      return emotion.css`
        color: ${t.calendarCellWeekendColor};
      `;
    },

    today(t: Theme) {
      return emotion.css`
        border: ${t.calendarCellTodayBorder};
      `;
    },

  todayCaption2022(t: Theme) {
      return emotion.css`
        padding-bottom: 2px;
        border-bottom: ${t.calendarCellTodayBorder};
      `;
    },
  });
