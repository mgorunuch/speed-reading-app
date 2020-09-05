import React from 'react';
import { ThemedBem } from '@igor-gerasimovich/bem-helper';
import { withTheme, WithThemeProps } from '../../contexts/with-theme';
import './button.scss';

const bem = new ThemedBem('button');

interface ComponentProps {
  className?: string;
  onClick: () => void;
}
type Props = ComponentProps & WithThemeProps;

class Button extends React.PureComponent<Props> {
  render() {
    const {
      theme: { name },
      children,
      className,
      onClick,
    } = this.props;

    bem.useTheme(name);

    const rootClasses = [bem.block()];
    if (className) {
      rootClasses.push(className);
    }

    return (
      <button onClick={onClick} className={rootClasses.join(' ')} type="button">{children}</button>
    );
  }
}

export default withTheme(Button);
