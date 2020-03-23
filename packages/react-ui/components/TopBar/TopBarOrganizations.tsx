import React from 'react';

import { getJsStyles } from '../../lib/theming/ThemeCache';
import { Nullable } from '../../typings/utility-types';
import { ArrowChevronDownIcon } from '../../internal/icons/16px';

import { TopBar } from './TopBar';
import { TopBarDropdown } from './TopBarDropdown';
import { Styles } from "./TopBar.styles";

export interface TopBarOrganizationsProps {
  caption: React.ReactNode;
  comment?: Nullable<string>;
}

export interface TopBarOrganizationsState {
  captionWhiteSpace: React.CSSProperties['whiteSpace'];
  minWidth: Nullable<number>;
}
/**
 * Дропдаун с организациями
 *
 * @visibleName TopBar.OrganizationsDropdown
 */

export class TopBarOrganizations extends React.Component<TopBarOrganizationsProps, TopBarOrganizationsState> {
  public static __KONTUR_REACT_UI__ = 'TopBarOrganizations';

  public state = {
    captionWhiteSpace: 'normal' as React.CSSProperties['whiteSpace'],
    minWidth: null,
  };

  private _caption: Nullable<HTMLElement>;
  private _comment: Nullable<HTMLElement>;

  public componentDidMount() {
    this._recalculateWidth();
  }

  public componentDidUpdate(prevProps: TopBarOrganizationsProps) {
    if (prevProps.caption !== this.props.caption) {
      this._recalculateWidth();
    }
  }

  public render() {
    const { caption, comment } = this.props;
    const jsStyles = getJsStyles(TopBar, Styles);

    const title = (
      <div>
        <span
          className={jsStyles.organizationsTitle()}
          style={{
            paddingRight: this._comment ? this._comment.offsetWidth + 30 : undefined,
          }}
        >
          <span ref={this._getCaptionRef}>{caption}</span>
          {comment && (
            <span className={jsStyles.organizationsComment()} ref={this._getCommentRef}>
              {comment}
            </span>
          )}
          <span className={jsStyles.organizationsArrow()}>
            <ArrowChevronDownIcon color="#aaa" size={14} />
          </span>
        </span>
        <div className={jsStyles.organizationsTitleDummy()} style={{ whiteSpace: this.state.captionWhiteSpace }}>
          <span>{caption}</span>
          {comment && <span className={jsStyles.organizationsCommentDummy()}>{comment}</span>}
        </div>
      </div>
    );

    return (
      <TopBarDropdown {...this.props} label={title} minWidth={this.state.minWidth}>
        {this.props.children}
      </TopBarDropdown>
    );
  }

  private _getCaptionRef = (element: HTMLSpanElement) => {
    this._caption = element;
  };

  private _getCommentRef = (element: HTMLSpanElement) => {
    this._comment = element;
  };

  private _recalculateWidth() {
    const commentWidth = this._comment ? this._comment.offsetWidth : 0;
    if (!this._caption) {
      return;
    }
    // 360 is minWidth from guides. Apply it when content is bigger.
    // 315 is because of 15px left padding and 30px arrow.
    if (this._caption.offsetWidth + commentWidth > 315) {
      this.setState({
        captionWhiteSpace: 'normal',
        minWidth: 360,
      });
    } else {
      this.setState({
        captionWhiteSpace: 'nowrap',
        minWidth: null,
      });
    }
  }
}
