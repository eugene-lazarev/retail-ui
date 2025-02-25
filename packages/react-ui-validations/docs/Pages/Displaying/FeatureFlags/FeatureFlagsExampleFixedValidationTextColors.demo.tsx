import React from 'react';
import {
  DARK_THEME,
  Gapped,
  Input,
  ThemeContext,
  ThemeFactory,
} from '@skbkontur/react-ui';

import {
  text,
  ValidationContainer,
  ValidationsFeatureFlagsContext,
  ValidationWrapper,
} from '../../../../src';

function ValidationExamples() {
  return (
    <ValidationContainer>
      <Gapped style={{ padding: '10px 10px 30px' }}>
        <ValidationWrapper
          validationInfo={{
            level: 'error',
            type: 'immediate',
            message: 'Error message',
          }}
          renderMessage={text('bottom')}
        >
          <Input />
        </ValidationWrapper>
        <ValidationWrapper
          validationInfo={{
            level: 'warning',
            type: 'immediate',
            message: 'Error message',
          }}
          renderMessage={text('bottom')}
        >
          <Input />
        </ValidationWrapper>
      </Gapped>
    </ValidationContainer>
  );
}

function LightTheme() {
  return (
    <ValidationsFeatureFlagsContext.Provider value={{ fixedValidationTextColors: true }}>
      <ValidationExamples />
    </ValidationsFeatureFlagsContext.Provider>
  );
}

function DarkTheme() {
  return (
    <div style={{ background: '#2b2b2b' }}>
      <ThemeContext.Provider value={DARK_THEME}>
        <ValidationsFeatureFlagsContext.Provider
          value={{ fixedValidationTextColors: true }}
        >
          <ValidationExamples />
        </ValidationsFeatureFlagsContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

function CustomTheme() {
  return (
    <div style={{ background: '#faf7f3' }}>
      <ThemeContext.Provider
        value={ThemeFactory.create({
          validationsTextColorWarning: 'orange',
          validationsTextColorError: 'red',
        })}
      >
        <ValidationsFeatureFlagsContext.Provider
          value={{ fixedValidationTextColors: true }}
        >
          <ValidationExamples />
        </ValidationsFeatureFlagsContext.Provider>
      </ThemeContext.Provider>
    </div>
  );
}

export default function FeatureFlagsExampleFixedValidationTextColors() {
  return (
    <Gapped vertical>
      <LightTheme />
      <DarkTheme />
      <CustomTheme />
    </Gapped>
  );
}
