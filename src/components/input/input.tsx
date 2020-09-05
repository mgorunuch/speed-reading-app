import React from 'react';
import { ThemedBem } from '@igor-gerasimovich/bem-helper';
import { withTheme, WithThemeProps } from '../../contexts/with-theme';
import { generateFakeID } from '../../utils/fake-id';
import './input.scss';

const bem = new ThemedBem('textarea');

interface ComponentProps {
  nativeRef?: React.RefObject<HTMLInputElement>;
  label: string;
  className?: string;
}
type Props = ComponentProps & WithThemeProps;

interface State {
  id: string;
}

class Input extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      id: generateFakeID('input'),
    };
  }

  render() {
    const {
      nativeRef,
      theme: { name },
      label,
      className,
    } = this.props;
    const { id } = this.state;

    bem.useTheme(name);

    const rootIDs = [bem.block()];
    if (className) {
      rootIDs.push(className);
    }

    return (
      <div className={rootIDs.join(' ')}>
        <label className={bem.element('label')} htmlFor={id}>
          {label && <div className={bem.element('label-text')}>{label}</div>}
          <input className={bem.element('native')} id={id} ref={nativeRef} />
        </label>
      </div>
    );
  }
}

export default withTheme(Input);
