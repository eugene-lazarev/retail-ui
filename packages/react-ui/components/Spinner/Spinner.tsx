import React from 'react';
import PropTypes from 'prop-types';

import { locale } from '../../lib/locale/decorators';
import { Theme } from '../../lib/theming/Theme';
import { ThemeContext } from '../../lib/theming/ThemeContext';
import { SpinnerIcon } from '../../internal/icons/SpinnerIcon';
import { CommonProps, CommonWrapper } from '../../internal/CommonWrapper';
import { cx } from '../../lib/theming/Emotion';
import { rootNode, TSetRootNode } from '../../lib/rootNode';
import { createPropsGetter } from '../../lib/createPropsGetter';
import {
  ReactUIFeatureFlags,
  ReactUIFeatureFlagsContext,
  getFullReactUIFlagsContext,
} from '../../lib/featureFlagsContext';

import { styles } from './Spinner.styles';
import { SpinnerLocale, SpinnerLocaleHelper } from './locale';

const types = ['big', 'mini', 'normal'] as const;

export type SpinnerType = typeof types[number];

export interface SpinnerProps extends CommonProps {
  /**
   * Подпись под спиннером
   */
  caption?: React.ReactNode;
  /**
   * Переводит спиннер в "затемнённый режим"
   *
   * Цвет спиннера в "затемнённом режиме" определяется переменной `spinnerDimmedColor`
   */
  dimmed?: boolean;
  /**
   * Размер спиннера и текста
   *
   * @default normal
   */
  type?: SpinnerType;
  inline?: boolean;
  /**
   * Толщина спиннера
   */
  width?: number;
  /**
   * Цвет спиннера
   */
  color?: React.CSSProperties['color'];
}

export const SpinnerDataTids = {
  root: 'Spinner__root',
} as const;

type DefaultProps = Required<Pick<SpinnerProps, 'type'>>;

/**
 * Используйте компонент `Spinner`, если вам нужен спиннер, без дополнительного функционала, который предоставляет компонент [Loader](https://tech.skbkontur.ru/react-ui/#/Components/Loader)
 */

@rootNode
@locale('Spinner', SpinnerLocaleHelper)
export class Spinner extends React.Component<SpinnerProps> {
  public static __KONTUR_REACT_UI__ = 'Spinner';

  public static propTypes = {
    /**
     * Текст рядом с мини-лоадером.
     *
     * 'Загрузка' - значение по-умолчанию
     */
    caption: PropTypes.node,

    dimmed: PropTypes.bool,

    /**
     * Тип спиннера: mini, normal, big
     *
     * Значение по-умолчанию - normal
     *
     * Spinner.types - все доступные типы
     */
    type: PropTypes.oneOf(types),
  };

  public static defaultProps: DefaultProps = {
    type: 'normal',
  };

  private getProps = createPropsGetter(Spinner.defaultProps);

  public static Types: Record<SpinnerType, SpinnerType> = Object.assign({}, ...types.map((type) => ({ [type]: type })));
  private theme!: Theme;
  private readonly locale!: SpinnerLocale;
  private setRootNode!: TSetRootNode;
  private featureFlags!: ReactUIFeatureFlags;

  public render() {
    return (
      <ReactUIFeatureFlagsContext.Consumer>
        {(flags) => {
          this.featureFlags = getFullReactUIFlagsContext(flags);
          return (
            <ThemeContext.Consumer>
              {(theme) => {
                this.theme = theme;
                return this.renderMain();
              }}
            </ThemeContext.Consumer>
          );
        }}
      </ReactUIFeatureFlagsContext.Consumer>
    );
  }

  private renderMain() {
    const canDefaultCaptionBeRemoved = this.featureFlags.spinnerLoaderRemoveDefaultCaption;
    const defaultCaption = canDefaultCaptionBeRemoved ? null : this.locale.loading;
    const { caption = defaultCaption, dimmed, inline } = this.props;
    const type = this.getProps().type;

    return (
      <CommonWrapper rootNodeRef={this.setRootNode} {...this.props}>
        <div data-tid={SpinnerDataTids.root} className={styles.spinner()}>
          <span className={styles.inner()}>{this.renderSpinner(type, dimmed, inline)}</span>
          {caption && this.renderCaption(type, caption)}
        </div>
      </CommonWrapper>
    );
  }

  private renderSpinner = (type: SpinnerType, dimmed?: boolean, inline?: boolean) => {
    return (
      <SpinnerIcon
        size={type}
        className={cx({
          [styles.circle(this.theme)]: !dimmed && !this.props.color,
          [styles.circleDimmedColor(this.theme)]: dimmed,
          [styles.circleWithoutColorAnimation()]: dimmed || !!this.props.color,
        })}
        dimmed={dimmed}
        width={this.props.width}
        color={this.props.color}
        inline={inline}
      />
    );
  };

  private renderCaption = (type: SpinnerType, caption: React.ReactNode) => (
    <span className={cx(styles[type](this.theme), styles.captionColor(this.theme))}>{caption}</span>
  );
}
