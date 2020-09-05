/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

export interface ThemeContext {
  name: string;
  toggleTheme: () => void;
}

export const defaultContext = {
  name: 'light',
  toggleTheme: () => {},
};

const context = React.createContext<ThemeContext>(defaultContext);

export const ThemeConsumer = context.Consumer;

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

interface Props {
  initialTheme?: Theme;
}

interface State {
  themeName: Theme;
}

export class ThemeProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const themeName = props.initialTheme || Theme.Light;

    this.state = {
      themeName,
    };
  }

  toggleTheme = (): void => {
    this.setState((state: State) => ({
      themeName: state.themeName === Theme.Light ? Theme.Dark : Theme.Light,
    }));
  };

  render() {
    const {
      children,
    } = this.props;
    const {
      themeName,
    } = this.state;

    return (
      <context.Provider
        value={{
          name: themeName,
          toggleTheme: this.toggleTheme,
        }}
      >
        {children}
      </context.Provider>
    );
  }
}

export interface WithThemeProps {
  theme: ThemeContext;
}

export const withTheme = <P extends WithThemeProps>(
  Component: React.ComponentType<P>,
): React.FunctionComponent<Omit<P, 'theme'>> => (props: Omit<P, 'theme'>) => {
    return (
      <ThemeConsumer>
        {(value: ThemeContext) => <Component {...props as P} theme={value} />}
      </ThemeConsumer>
    );
  };
