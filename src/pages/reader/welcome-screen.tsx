import React from 'react';
import { ThemedBem } from '@igor-gerasimovich/bem-helper';
import './welcome-screen.scss';
import { withTheme, WithThemeProps } from '../../contexts/with-theme';
import Button from '../../components/button/button';
import Textarea from '../../components/textarea/textarea';
import Input from '../../components/input/input';

const bem = new ThemedBem('reader-welcome');

interface ComponentProps {
  onStart: (text: string, speedWPM: number) => void;
}

type Props = ComponentProps & WithThemeProps;

class WelcomeScreen extends React.PureComponent<Props> {
  textareaRef: React.RefObject<HTMLTextAreaElement>;

  speedRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.textareaRef = React.createRef();
    this.speedRef = React.createRef();
  }

  submit = () => {
    const {
      onStart,
    } = this.props;

    if (!this.textareaRef.current || !this.speedRef.current) {
      return;
    }

    const speed = Number(this.speedRef.current.value);

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(speed)) {
      return;
    }

    if (!this.textareaRef.current.value) {
      onStart('\n'
        + '\n'
        + 'The United States Department of Agriculture (USDA), which enforces the Animal Welfare Act, does not mandate TB testing.\n'
        + '\n'
        + 'Three out of four new or emerging infectious diseases in humans come from animals, according to the Centers for Disease Control and Prevention (CDC). This makes it important to stop the spread of tuberculosis among captive elephants, says Fleur Dawes, communications director for In Defense of Animals, an animal welfare organization that has campaigned to end the keeping of elephants in captivity.\n'
        + '\n'
        + 'There are multiple strains of TB—a bacterial infection that spreads through the air and can be transmitted by humans through coughs or sneezes. Infected elephants are thought to spread TB when they spray liquid or air out of their trunks, although no study has confirmed this. Elephants can contract both the human and bovine strains. For both humans and elephants, treatment is a months-long drug regimen.', speed);
      return;
    }

    onStart(this.textareaRef.current.value, speed);
  };

  render() {
    const {
      theme: { name },
    } = this.props;

    bem.useTheme(name);

    return (
      <div className={bem.block()}>
        <h1 className={bem.element('title')}>Lets start</h1>
        <div className={bem.element('settings')}>
          <Textarea className={bem.element('field')} label="Reading text" nativeRef={this.textareaRef} />
          <Input className={bem.element('field')} label="Words per minute" nativeRef={this.speedRef} />
        </div>
        <div className={bem.element('actions')}>
          <Button onClick={this.submit}>Start</Button>
        </div>
      </div>
    );
  }
}

export default withTheme(WelcomeScreen);
