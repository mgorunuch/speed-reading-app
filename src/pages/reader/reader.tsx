import React from 'react';
import { ThemedBem } from '@igor-gerasimovich/bem-helper';
import { withTheme, WithThemeProps } from '../../contexts/with-theme';
import './reader.scss';
import WelcomeScreen from './welcome-screen';
import { Paragraph, Sentence } from '../../types/word';
import ReaderScreen from './reader-screen';

enum Screen {
  Welcome,
  Reader,
}

const bem = new ThemedBem('reader-page');
const sentenceSplitRegexp = new RegExp(/[^.!?]+[.!?]+/g);

interface ComponentProps {}
type Props = ComponentProps & WithThemeProps;

interface State {
  paragraphs: Paragraph[];
  currentScreen: Screen,
  speed: number,
}

class Reader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      paragraphs: [],
      currentScreen: Screen.Welcome,
      speed: 0,
    };
  }

  onStartClicked = (text: string, speed: number) => {
    const dirtyParagraphs = text.split('\n')
      .map(
        (par): Paragraph => {
          const res = par.match(sentenceSplitRegexp);

          if (res === null) {
            return [];
          }

          return res.map((sent): Sentence => sent.split(' '));
        },
      );

    const paragraphs = dirtyParagraphs.map(
      (par) => par.map(
        (sent) => sent
          .filter((word) => word.trim().length > 0),
      ).filter((sent) => sent.length > 0),
    ).filter((par) => par.length > 0);

    this.setState({
      paragraphs,
      currentScreen: Screen.Reader,
      speed,
    });
  };

  loadParagraph = (prevIdx: number): Paragraph => {
    const {
      paragraphs,
    } = this.state;

    const nextIdx = prevIdx + 1;

    if (paragraphs.length <= nextIdx) {
      return [];
    }

    return paragraphs[nextIdx];
  };

  render() {
    const {
      theme: { name },
    } = this.props;
    const {
      paragraphs,
      currentScreen,
      speed,
    } = this.state;

    bem.useTheme(name);

    return (
      <div className={bem.block()}>
        {currentScreen === Screen.Welcome && <WelcomeScreen onStart={this.onStartClicked} />}
        {currentScreen === Screen.Reader && (
          <ReaderScreen
            loadNewParagraph={this.loadParagraph}
            initialIParagraphIdx={0}
            initialParagraph={paragraphs[0]}
            totalParagraphs={paragraphs.length}
            initialSpeed={speed}
          />
        )}
      </div>
    );
  }
}

export default withTheme(Reader);
