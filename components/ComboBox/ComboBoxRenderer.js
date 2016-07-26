// @flow

import classNames from 'classnames';
import events from 'add-event-listener';
import React from 'react';
import ReactDOM from 'react-dom';

import filterProps from '../filterProps';
import listenFocusOutside from '../../lib/listenFocusOutside';
import Upgrades from '../../lib/Upgrades';

import Input from '../Input';
import InputLikeText from '../internal/InputLikeText/InputLikeText';
import Menu from '../Menu/Menu';
import MenuItem from '../MenuItem/MenuItem';

import styles from './ComboBoxRenderer.less';

const INPUT_PASS_PROPS = {
  borderless: true,
  error: true,
  warning: true,
  width: true,

  onFocus: true,
  onBlur: true,
};

export type Value = any;
export type Info = any;

type SourceResult = {
  values: Array<Value | React.Element<any> | (() => React.Element<any>)>,
  infos?: Array<Info>,
  total?: number,
};

type RecoverResult = {
  value: Value,
  info?: Info,
};

type ErrorKind = null | 'not_recovered';

type RecoverFunc = (searchString: string) => RecoverResult;

export type BaseProps = {
  autoFocus?: bool,
  borderless?: bool,
  disabled?: bool,
  error?: bool,
  info?: Info | (v: Value) => Promise<Info>,
  menuAlign: 'left' | 'right',
  openButton?: bool,
  placeholder: string,
  recover?: (RecoverFunc | bool),
  renderItem: (value: Value, info: Info) => React.Element<any>,
  renderValue: (value: Value, info: ?Info) => React.Element<any>,
  source: (searchText: string) => Promise<SourceResult>,
  warning?: bool,
  value: Value | null,
  width: (number | string),

  onBlur?: () => void,
  onChange?: (event: {target: {value: Value}}, value: Value) => void,
  onClose?: () => void,
  onError?: (kind: ErrorKind) => void,
  onFocus?: () => void,
  onOpen?: () => void,

  alkoValueToText?: (value: Value) => string,
};

type Props = BaseProps & {
  info: Info,
};

type State = {
  opened: bool,
  searchText: string,
  result: ?SourceResult,
};

class ComboBoxRenderer extends React.Component {
  static Item = class Item extends React.Component {
    render() {
      return <MenuItem>{this.props.children}</MenuItem>;
    }
  };

  static static(element: ((() => React.Element<any>) | React.Element<any>)) {
    return element;
  }


  static defaultProps = {
    renderItem,
    renderValue,
    placeholder: '',
    width: (250: number | string),
    menuAlign: 'left',
  };

  props: Props;
  state: State;

  _focusable: ?HTMLInputElement = null;
  _menu: ?Menu = null;
  _focusSubscribtion: ?{remove: () => void} = null;
  _lastError: ErrorKind = null;

  constructor(props: Props, context: mixed) {
    super(props, context);

    this.state = {
      opened: false,
      searchText: '',
      result: null,
      selected: -1,
    };
  }

  render() {
    const className = classNames({
      [styles.root]: true,
      [styles.deprecated_oldSize]: !Upgrades.isHeight34Enabled(),
    });

    let valueEl;
    if (this.state.opened || this.state.searchText) {
      valueEl = this.renderOpenedValue();
    } else {
      valueEl = this.renderClosedValue();
    }

    return (
      <label className={className} style={{width: this.props.width}}>
        {valueEl}
        {this.state.opened && (
          <div ref={this._refMenuHolder} className={styles.menuHolder}>
            {this.renderMenu()}
          </div>
        )}
        {this.props.openButton && (
          <div className={styles.arrow} onMouseDown={this._handleArrowMouseDown}
            onClick={this._handleArrowClick}
          />
        )}
      </label>
    );
  }

  renderOpenedValue() {
    const inputProps = filterProps(this.props, INPUT_PASS_PROPS);
    if (!this.state.opened) {
      inputProps.error = true;
    }
    return (
      <div className={styles.input}>
        <Input ref={this._refFocusable} {...inputProps}
          value={this.state.searchText}
          rightIcon={this.props.openButton && <span />}
          disabled={this.props.disabled} onChange={this._handleInputChange}
          onKeyDown={this._handleInputKey}
        />
      </div>
    );
  }

  renderClosedValue() {
    const inputProps = filterProps(this.props, INPUT_PASS_PROPS);

    let value;
    if (this.props.value == null) {
      value = (
        <span className={styles.placeholder}>{this.props.placeholder}</span>
      );
    } else {
      value = this.props.renderValue(this.props.value, this.props.info);
    }

    return (
      <InputLikeText ref={this._refFocusable} {...inputProps}
        padRight={this.props.openButton}
        onClick={this._handleValueClick} onKeyDown={this._handleValueKey}
        onKeyPress={this._handleValueKeyPress}
      >
        {value}
      </InputLikeText>
    );
  }

  renderMenu() {
    const {result} = this.state;
    if (!result || result.values.length === 0) {
      return null;
    }
    const menuClassName = classNames({
      [styles.menu]: true,
      [styles.menuAlignRight]: this.props.menuAlign === 'right',
    });
    return (
      <div className={menuClassName}>
        <Menu ref={this._refMenu} maxHeight={200}>
          {mapResult(result, (value, info, i) => {
            if (typeof value === 'function' || React.isValidElement(value)) {
              const element = typeof value === 'function' ? value() : value;
              return React.cloneElement(
                element,
                {
                  key: i,
                  onClick: this._handleItemClick.bind(this, element.props),
                },
              );
            }
            return (
              <MenuItem key={i}
                onClick={this._handleItemClick.bind(this, {value, info})}
              >
                {this.props.renderItem(value, info)}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }

  focus() {
    if (this._focusable) {
      this._focusable.focus();
    }
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus();
    }
  }

  _refFocusable = (el: ?HTMLInputElement) => {
    this._focusable = el && (el.focus ? el : ReactDOM.findDOMNode(el));
  };

  _refMenuHolder = (menuHolder: any) => {
    if (this._focusSubscribtion) {
      this._focusSubscribtion.remove();
      this._focusSubscribtion = null;

      events.removeEventListener(
        document, 'mousedown', this._handleNativeDocClick
      );
    }

    if (menuHolder) {
      this._focusSubscribtion = listenFocusOutside(
        [ReactDOM.findDOMNode(this)],
        () => {
          this._close();
          this._tryRecover();
        }
      );

      events.addEventListener(
        document, 'mousedown', this._handleNativeDocClick
      );
    }
  };

  _refMenu = (menu: Menu) => {
    this._menu = menu;
  };

  _handleInputChange = (event: SyntheticEvent) => {
    const pattern = (event.target: any).value;
    this._open();
    this.setState({
      searchText: pattern,
    });
    this._fetchList(pattern);
  };

  _handleInputKey = (event: SyntheticKeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this._menu && this._menu.up();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this._menu && this._menu.down();
        break;
      case 'Enter':
        event.preventDefault();

        const handled = this._menu && !this._menu.enter();
        if (!handled) {
          this._tryRecover();

          // Close ComboBox only if Enter wasn't handled by the Menu.
          this._close(() => {
            this._focus();
          });
        }
        break;
      case 'Escape':
        this.setState({searchText: ''});
        this._close(() => {
          this._focus();
        });
        break;
    }
  };

  _handleValueClick = () => {
    this._open();
    this.setState({
      searchText: '',
      result: null,
    });
    this._alkoSetCurrentSearchText(this.props.value);
    this._focusAsync();
    this._fetchList('');
  };

  _handleValueKeyPress = (event: SyntheticKeyboardEvent) => {
    // Prevent current char from being appended to the input element (chrome).
    event.preventDefault();
    const str = String.fromCharCode(event.charCode);
    this._open();
    this.setState(
      {
        searchText: str,
      },
      () => {
        if (this._focusable) {
          this._focusable.setSelectionRange(1, 1);
        }
      }
    );
    this._fetchList(str);
  };

  _handleValueKey = (event: SyntheticKeyboardEvent) => {
    switch (event.key) {
      case ' ':
      case 'Enter':
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        this._open();
        this.setState({
          searchText: '',
        }, () => {
          this._focus();
        });
        this._alkoSetCurrentSearchText(this.props.value);
        this._fetchList('');
        break;
    }
  };

  _handleItemClick(
    options: {value?: Value, info?: Info, onClick?: () => void}
  ) {
    this._close();
    this._change(options.value, options.info);
    this._focusAsync();

    if (options.onClick) {
      const onClick = options.onClick;
      onClick();
    }
  }

  _handleArrowMouseDown = (event: SyntheticMouseEvent) => {
    event.preventDefault();
  };

  _handleArrowClick = (event: SyntheticMouseEvent) => {
    if (!this.state.opened) {
      this._handleValueClick();
    }
  };

  _handleNativeDocClick = (event: MouseEvent) => {
    const target: Element = (event.target: any) || event.srcElement;

    const thisDOM: Element = ReactDOM.findDOMNode(this);
    const menuDOM: ?Element = this._menu && ReactDOM.findDOMNode(this._menu);
    if (thisDOM.contains(target) || menuDOM && menuDOM.contains(target)) {
      return;
    }

    // Go async to let blur event happen before focused element removed from the
    // document.
    process.nextTick(() => {
      this._close();
      this._tryRecover();
    });
  };

  _fetchList(pattern: string) {
    this.props.source(pattern).then((result) => {
      if (this.state.searchText === pattern) {
        this._menu && this._menu.reset();
        this.setState({result});
      }
    });
  }

  _focus = () => {
    if (this._focusable) {
      this._focusable.focus();
    }
  };

  _focusAsync() {
    process.nextTick(this._focus);
  }

  _tryRecover() {
    const searchText = this.state.searchText;
    let recovered: ?RecoverResult = null;
    if (typeof this.props.recover === 'function') {
      recovered = this.props.recover(searchText);
    } else if (this.props.recover === true) {
      recovered = {value: searchText};
    }

    if (recovered) {
      this.setState({searchText: ''});
      this._change(recovered.value, recovered.info);
      this._setError(null);
    } else {
      this._change(null);
      this._setError(this.state.searchText ? 'not_recovered' : null);
    }
  }

  _setError(error: ErrorKind) {
    if (this._lastError !== error && this.props.onError) {
      this._lastError = error;
      this.props.onError(error);
    }
  }

  _change(value: Value, info?: Info) {
    if (this.props.onChange) {
      this.props.onChange({target: {value}}, value, info);
    }
  }

  _open() {
    this.setState({
      opened: true,
    });
    if (this.props.onOpen) {
      this.props.onOpen.call(null);
    }
  }

  _close(callback: any) {
    this.setState({
      opened: false,
      result: null,
    }, callback);
    if (this.props.onClose) {
      this.props.onClose.call(null);
    }
  }

  _findInfoByValue(value: Value): ?Info {
    const {result} = this.state;
    if (result) {
      const index = result.values.findIndex((v) => v === value);
      return result.infos && result.infos[index];
    }

    return null;
  }

  _alkoSetCurrentSearchText(value: Value) {
    if (this.props.alkoValueToText && value) {
      const searchText = this.props.alkoValueToText(value);
      this.setState(
        {searchText},
        () => {
          if (this._focusable && this._focusable.setSelectionRange) {
            this._focusable.setSelectionRange(0, searchText.length);
          }
        },
      );
    }
  }
}

function mapResult(
  result: SourceResult,
  fn: (v: Value, d: Info, i: number) => any
): Array<any> {
  return result.values.map((value, i) => {
    const info = result.infos && result.infos[i];
    return fn(value, info, i);
  });
}

function renderValue(value, info) {
  return info;
}

function renderItem(value, info) {
  return info;
}

export default ComboBoxRenderer;
