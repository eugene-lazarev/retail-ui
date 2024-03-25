import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { InputMask, MaskedPatternOptions } from 'imask';
import { IMaskInput, IMaskInputProps } from 'react-imask';

import { Input, InputProps, InputType } from '../Input';
import { Nullable } from '../../typings/utility-types';
import { MaskedInputElement, MaskedShadows } from '../../internal/MaskedInputElement';
import { forwardRefAndName } from '../../lib/forwardRefAndName';

import { getCompatibleIMaskProps, getFixedPartValue, getMasked, getMaskedShadows } from './MaskedInput.helpers';

export interface MaskedProps {
  /** Паттерн маски */
  mask?: IMaskInputProps<HTMLInputElement>['mask'];
  /** Символ маски */
  maskChar?: Nullable<string>;
  /**
   * Словарь символов-регулярок для маски
   * @default { '9': '[0-9]', 'a': '[A-Za-z]', '*': '[A-Za-z0-9]' }
   */
  formatChars?: Record<string, string>;
  /** Показывать символы маски */
  alwaysShowMask?: boolean;
  /**
   * Пропы для компонента `IMaskInput`
   *
   * @see https://imask.js.org/guide.html
   */
  imaskProps?: IMaskInputProps<HTMLInputElement>;
  /**
   * При фокусе, если `value` пустое, будет вызывать `onValueChange` с фиксированной частью маски в начале строки
   *
   * По блюру, если `value` не изменится, будет вызывать `onValueChange` с пустой строкой
   *
   * **Проп игнорируется, если `imaskProps.unmask = true`**
   *
   * @default true
   */
  applyFixedPart?: boolean;
}

export type MaskInputType = Exclude<InputType, 'number' | 'date' | 'time' | 'password'>;

export interface IMaskRefType {
  maskRef: InputMask<MaskedPatternOptions>;
  element: HTMLInputElement;
}

export interface MaskedInputProps extends MaskedProps, Omit<InputProps, 'mask' | 'maxLength' | 'type'> {
  type?: MaskInputType;
}

/**
 * Интерфейс пропсов наследуется от `Input`.
 * Из пропсов `Input` исключены некоторые не применимые к полю с маской пропсы и сокращен список возможных значений в type.
 */
export const MaskedInput = forwardRefAndName(
  'MaskedInput',
  function MaskedInput(props: MaskedInputProps, ref: Ref<Input | null>) {
    const {
      mask,
      maskChar,
      formatChars,
      alwaysShowMask,
      imaskProps: { onAccept, ...customIMaskProps } = {},
      applyFixedPart = true,
      placeholder,
      onValueChange,
      onUnexpectedInput,
      element,
      ...inputProps
    } = props;

    const inputRef = useRef<Input>(null);
    const imaskRef = useRef<IMaskRefType>(null);

    const [focused, setFocused] = useState(false);
    const [maskedShadows, setMaskedShadows] = useState<MaskedShadows>(['', '']);
    const valueVhanged = useRef(false);

    const showPlaceholder = !(alwaysShowMask || focused);

    useEffect(() => {
      setMaskedShadows(getMaskedShadows(getMasked(imaskRef, props)));
    }, [imaskRef.current, props.value, alwaysShowMask, focused]);

    useImperativeHandle(ref, () => inputRef.current, []);

    return (
      <Input
        ref={inputRef}
        {...inputProps}
        placeholder={showPlaceholder ? placeholder : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        element={
          <MaskedInputElement maskedShadows={alwaysShowMask || focused ? maskedShadows : null}>
            <IMaskInput
              ref={imaskRef}
              {...getCompatibleIMaskProps(props)}
              {...customIMaskProps}
              onAccept={handleAccept}
            />
          </MaskedInputElement>
        }
      />
    );

    function handleAccept(...args: Parameters<Required<IMaskInputProps<HTMLInputElement>>['onAccept']>) {
      const [value] = args;

      // обработка uncontrolled режима
      if (typeof props.value === 'undefined') {
        setMaskedShadows(getMaskedShadows(getMasked(imaskRef, props)));
      }

      valueVhanged.current = true;

      onValueChange?.(value);
      onAccept?.(...args);
    }

    // Отслеживаем неожиданные нажатия
    // handleAccept не вызывается когда значение с маской не меняется
    // Сначала вызывается handleAccept, затем handleInput
    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
      if (!valueVhanged.current) {
        if (onUnexpectedInput) {
          onUnexpectedInput(props.value || '');
        } else if (inputRef.current) {
          inputRef.current.blink();
        }
      }

      valueVhanged.current = false;

      props.onInput?.(e);
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setFocused(true);
      props.onFocus?.(e);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setFocused(false);
      props.onBlur?.(e);
    }

    // Если в маске есть фиксированные символы вначале строки, то рендерим их сразу при фокусе
    function getValueWithFixedPart() {
      const masked = getMasked(imaskRef, props);
      const fixedPartValue = getFixedPartValue(masked);

      if (!applyFixedPart || customIMaskProps.unmask || fixedPartValue === '' || props.value === fixedPartValue) {
        return props.value;
      }

      const nativeInputValue = imaskRef.current?.element.value || '';

      if (focused && nativeInputValue.length <= fixedPartValue.length) {
        // prevValue.current = fixedPartValue;
        valueVhanged.current = false;
        return fixedPartValue;
      }

      if (!focused && nativeInputValue === fixedPartValue) {
        // prevValue.current = '';
        // valueVhanged.current = true;
        return '';
      }

      return props.value;
    }
  },
);
