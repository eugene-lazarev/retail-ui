import type { Emotion } from '@emotion/css/create-instance';

import { memoizeStyle, prefix } from '../../lib/theming/Emotion';
import { Theme } from '../../lib/theming/Theme';

import {
  activeHandleSizeMixin,
  buttonSizeMixin,
  captionSizeMixin,
  containerSizeMixin,
  handleMixin,
  inputSizeMixin,
  toggleSizeMixin,
} from './Toggle.mixins';

export const globalClasses = prefix('toggle')({
  handle: 'handle',
  container: 'container',
  disabled: 'disabled',
  containerDisabled: 'container-disabled',
  containerLoading: 'container-loading',
  background: 'background',
});

export const getStyles = (emotion: Emotion) =>
  memoizeStyle({
    root(t: Theme) {
      return emotion.css`
        display: inline-flex;
        cursor: pointer;
        align-items: baseline;
        position: relative;

        &::before {
          // non-breaking space.
          // makes a correct space for absolutely positioned button,
          // and also height and baseline for toggle without caption.
          content: '\\00A0';
          display: inline-block;
          flex: 0 0 auto;
        }

        &:hover .${globalClasses.handle} {
          background: ${t.toggleBgHover};
        }
      `;
    },
    rootSmall(t: Theme) {
      return emotion.css`
        ${toggleSizeMixin(emotion)(t.toggleFontSizeSmall, t.toggleHeightSmall, t.toggleWidthSmall)};
      `;
    },
    rootMedium(t: Theme) {
      return emotion.css`
        ${toggleSizeMixin(emotion)(t.toggleFontSizeMedium, t.toggleHeightMedium, t.toggleWidthMedium)};
      `;
    },
    rootLarge(t: Theme) {
      return emotion.css`
        ${toggleSizeMixin(emotion)(t.toggleFontSizeLarge, t.toggleHeightLarge, t.toggleWidthLarge)};
      `;
    },

    activeHandleSmall(t: Theme) {
      return emotion.css`
        ${activeHandleSizeMixin(emotion)(
          t.toggleHandleSizeSmall,
          t.toggleBorderWidth,
          t.toggleHandleActiveWidthIncrement,
          t.toggleWidthSmall,
        )};
      `;
    },
    activeHandleMedium(t: Theme) {
      return emotion.css`
        ${activeHandleSizeMixin(emotion)(
          t.toggleHandleSizeMedium,
          t.toggleBorderWidth,
          t.toggleHandleActiveWidthIncrement,
          t.toggleWidthMedium,
        )};
      `;
    },
    activeHandleLarge(t: Theme) {
      return emotion.css`
        ${activeHandleSizeMixin(emotion)(
          t.toggleHandleSizeLarge,
          t.toggleBorderWidth,
          t.toggleHandleActiveWidthIncrement,
          t.toggleWidthLarge,
        )};
      `;
    },

    disableAnimation() {
      return emotion.css`
        &,
        * {
          transition: none !important;
        }
      `;
    },

    handle(t: Theme) {
      return emotion.css`
        background: ${t.toggleHandleBg};
        bottom: ${t.toggleBorderWidth};
        box-shadow: ${t.toggleHandleBoxShadowOld};
        left: ${t.toggleHandleLeft};
        position: absolute;
        top: ${t.toggleHandleTop};
        transition: 0.2s ease-in;
      `;
    },
    handleSmall(t: Theme) {
      return emotion.css`
        ${handleMixin(emotion)(t.toggleHandleSizeSmall, t.toggleHandleBorderRadiusSmall)};
      `;
    },
    handleMedium(t: Theme) {
      return emotion.css`
        ${handleMixin(emotion)(t.toggleHandleSizeMedium, t.toggleHandleBorderRadiusMedium)};
      `;
    },
    handleLarge(t: Theme) {
      return emotion.css`
        ${handleMixin(emotion)(t.toggleHandleSizeLarge, t.toggleHandleBorderRadiusLarge)};
      `;
    },

    handleDisabled(t: Theme) {
      return emotion.css`
        background: ${t.toggleDisabledHandleBg} !important; // override root hover/active styles
      `;
    },

    input(t: Theme) {
      return emotion.css`
        position: absolute;
        opacity: 0;

        &:focus {
          outline: none;
        }
        &:checked ~ .${globalClasses.container} {
          box-shadow: inset 0 0 0 ${t.toggleBorderWidth} ${t.toggleBgChecked};
          background: ${t.toggleBgChecked};
          transition: background 0s 0.2s;
        }
        &:checked ~ .${globalClasses.containerDisabled} {
          box-shadow: inset 0 0 0 ${t.toggleBorderWidth} ${t.toggleBorderColorDisabledChecked};
          background: ${t.toggleBgDisabledChecked};
          transition: background 0s 0.2s;
        }
        &:checked ~ .${globalClasses.containerLoading} {
          background: ${t.toggleBorderColor};
          box-shadow: inset 0 0 0 ${t.toggleBorderWidth} ${t.toggleBorderColor};
        }
        &:checked ~ .${globalClasses.container} .${globalClasses.background} {
          width: 70%;
          background: ${t.toggleBgChecked};
        }
        &:checked ~ .${globalClasses.containerDisabled} .${globalClasses.background} {
          width: 70%;
          background: ${t.toggleBgDisabledChecked};
          box-shadow: inset 0 0 0 1px ${t.toggleBorderColorDisabledChecked};
        }
        &:checked ~ .${globalClasses.handle} {
          background: ${t.toggleCheckedBg};
          &:hover {
            background: ${t.toggleCheckedBgHover};
          }
        }
      `;
    },
    inputSmall(t: Theme) {
      return emotion.css`
        ${inputSizeMixin(emotion)(t.toggleHeightSmall, t.toggleWidthSmall)};
      `;
    },
    inputMedium(t: Theme) {
      return emotion.css`
        ${inputSizeMixin(emotion)(t.toggleHeightMedium, t.toggleWidthMedium)};
      `;
    },
    inputLarge(t: Theme) {
      return emotion.css`
        ${inputSizeMixin(emotion)(t.toggleHeightLarge, t.toggleWidthLarge)};
      `;
    },

    input2022(t: Theme) {
      return emotion.css`
        &:enabled {
          ~ .${globalClasses.container}, ~ .${globalClasses.handle} {
            transition: 0.2s ease-in;
          }
          :not(:checked) {
            ~ .${globalClasses.container} {
              background: ${t.toggleContainerBg};
              box-shadow: ${t.toggleContainerBoxShadow};
            }
            ~ .${globalClasses.handle} {
              background: ${t.toggleHandleBg};
              box-shadow: ${t.toggleHandleBoxShadow};
            }
          }
          :checked {
            ~ .${globalClasses.container} {
              background: ${t.toggleContainerBgChecked};
              box-shadow: ${t.toggleContainerBoxShadowChecked};
            }
            ~ .${globalClasses.handle} {
              background: ${t.toggleHandleBgChecked};
              box-shadow: ${t.toggleHandleBoxShadowChecked};
            }
          }
        }
        &:enabled:hover {
          :not(:checked) {
            ~ .${globalClasses.container} {
              background: ${t.toggleContainerBgHover};
              box-shadow: ${t.toggleContainerBoxShadowHover};
            }
            ~ .${globalClasses.handle} {
              background: ${t.toggleHandleBgHover};
              box-shadow: ${t.toggleHandleBoxShadowHover};
            }
          }
          :checked {
            ~ .${globalClasses.container} {
              background: ${t.toggleContainerBgCheckedHover};
              box-shadow: ${t.toggleContainerBoxShadowCheckedHover};
            }
            ~ .${globalClasses.handle} {
              background: ${t.toggleHandleBgCheckedHover};
              box-shadow: ${t.toggleHandleBoxShadowCheckedHover};
            }
          }
        }
        &:disabled {
          :not(:checked) {
            ~ .${globalClasses.container} {
              background: ${t.toggleContainerBgDisabled};
              box-shadow: ${t.toggleContainerBoxShadowDisabled};
            }
            ~ .${globalClasses.handle} {
              background: ${t.toggleHandleBgDisabled} !important;
              box-shadow: ${t.toggleHandleBoxShadowDisabled};
            }
          }
          :checked {
            ~ .${globalClasses.container} {
              background: ${t.toggleContainerBgDisabledChecked};
              box-shadow: ${t.toggleContainerBoxShadowDisabledChecked};
            }
            ~ .${globalClasses.handle} {
              background: ${t.toggleHandleBgDisabledChecked} !important;
              box-shadow: ${t.toggleHandleBoxShadowDisabledChecked};
            }
          }
        }
      `;
    },

    container(t: Theme) {
      return emotion.css`
        box-shadow: inset 0 0 0 ${t.toggleBorderWidth} ${t.toggleBorderColor};
        height: 100%;
        overflow: hidden;
        position: absolute;
        width: 100%;
        /* fixes overflow issue in Safari: https://bugs.webkit.org/show_bug.cgi?id=98538 */
        z-index: 0;
      `;
    },
    containerSmall(t: Theme) {
      return emotion.css`
        ${containerSizeMixin(emotion)(t.toggleBorderRadiusSmall)};
      `;
    },
    containerMedium(t: Theme) {
      return emotion.css`
        ${containerSizeMixin(emotion)(t.toggleBorderRadiusMedium)};
      `;
    },
    containerLarge(t: Theme) {
      return emotion.css`
        ${containerSizeMixin(emotion)(t.toggleBorderRadiusLarge)};
      `;
    },

    containerDisabled(t: Theme) {
      return emotion.css`
        background: ${t.toggleBgDisabled};
        box-shadow: inset 0 0 0 1px ${t.toggleBorderColorDisabled};
      `;
    },

    focused(t: Theme) {
      return emotion.css`
        box-shadow: 0 0 0 1px ${t.toggleOutlineColorFocus}, 0 0 0 ${t.toggleOutlineWidth} ${t.toggleFocusShadowColor};
      `;
    },

    activeBackground() {
      return emotion.css`
        background: inherit;
        bottom: 0;
        left: 0;
        position: absolute;
        top: 0;
        transition: 0.2s ease-in;
        width: 10px;
      `;
    },

    disabledBackground(t: Theme) {
      return emotion.css`
        box-shadow: inset 0 0 0 1px ${t.toggleBorderColorDisabled};
        width: 0;
      `;
    },

    activeBackgroundLoading(t: Theme) {
      return emotion.css`
        background: ${t.toggleBgActive};
      `;
    },

    isWarning(t: Theme) {
      return emotion.css`
        box-shadow: 0 0 0 1px ${t.toggleOutlineColorFocus}, 0 0 0 ${t.toggleOutlineWidth} ${t.toggleShadowColorWarning};
      `;
    },

    isError(t: Theme) {
      return emotion.css`
        box-shadow: 0 0 0 1px ${t.toggleOutlineColorFocus}, 0 0 0 ${t.toggleOutlineWidth} ${t.toggleShadowColorError};
      `;
    },

    button(t: Theme) {
      return emotion.css`
        position: absolute;
        left: 0;
        top: 0;
        background: ${t.toggleBaseBg};
        line-height: ${t.toggleHeight};
      `;
    },
    buttonSmall(t: Theme) {
      return emotion.css`
        ${buttonSizeMixin(emotion)(
          t.labGrotesqueBaselineCompensation,
          t.toggleFontSizeSmall,
          t.toggleHeightSmall,
          t.toggleWidthSmall,
          t.toggleBorderRadiusSmall,
          t.toggleButtonOffsetY,
        )};
      `;
    },
    buttonMedium(t: Theme) {
      return emotion.css`
        ${buttonSizeMixin(emotion)(
          t.labGrotesqueBaselineCompensation,
          t.toggleFontSizeMedium,
          t.toggleHeightMedium,
          t.toggleWidthMedium,
          t.toggleBorderRadiusMedium,
          t.toggleButtonOffsetY,
        )};
      `;
    },
    buttonLarge(t: Theme) {
      return emotion.css`
        ${buttonSizeMixin(emotion)(
          t.labGrotesqueBaselineCompensation,
          t.toggleFontSizeLarge,
          t.toggleHeightLarge,
          t.toggleWidthLarge,
          t.toggleBorderRadiusLarge,
          t.toggleButtonOffsetY,
        )};
      `;
    },

    buttonRight() {
      return emotion.css`
        right: 0;
        left: auto;
      `;
    },

    disabled() {
      return emotion.css`
        cursor: default;
      `;
    },

    rootLeft() {
      return emotion.css`
        flex-direction: row-reverse;
      `;
    },

    caption(t: Theme) {
      return emotion.css`
        color: ${t.toggleTextColor};
        padding: 0 0 0 ${t.toggleCaptionGap};
      `;
    },
    captionSmall(t: Theme) {
      return emotion.css`
        ${captionSizeMixin(emotion)(t.toggleFontSizeSmall, t.toggleHeightSmall)};
      `;
    },
    captionMedium(t: Theme) {
      return emotion.css`
        ${captionSizeMixin(emotion)(t.toggleFontSizeMedium, t.toggleHeightMedium)};
      `;
    },
    captionLarge(t: Theme) {
      return emotion.css`
        ${captionSizeMixin(emotion)(t.toggleFontSizeLarge, t.toggleHeightLarge)};
      `;
    },

    disabledCaption(t: Theme) {
      return emotion.css`
        color: ${t.textColorDisabled};
      `;
    },

    captionLeft(t: Theme) {
      return emotion.css`
        color: ${t.toggleTextColor};
        padding: 0 ${t.toggleCaptionGap} 0 0;
      `;
    },
  });
