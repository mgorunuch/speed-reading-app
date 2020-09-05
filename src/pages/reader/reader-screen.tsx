import React from 'react';
import { ThemedBem } from '@igor-gerasimovich/bem-helper';
import { withTheme, WithThemeProps } from '../../contexts/with-theme';
import { Paragraph } from '../../types/word';
import Button from '../../components/button/button';
import './reader-screen.scss';

const bem = new ThemedBem('reader-screen');

interface ComponentProps {
  initialParagraph: Paragraph;
  initialIParagraphIdx: number;
  loadNewParagraph: (prevIDx: number) => Paragraph;
  totalParagraphs: number;
  initialSpeed: number;
}
type Props = ComponentProps & WithThemeProps;
interface State {
  paragraphQueue: Paragraph[];
  currentParagraphIdx: number;
  currentParagraph: Paragraph;
  currentWordIdx: number;
  currentSentenceIdx: number;
  hasMoreParagraphs: boolean;
  interval: any;
  isStopped: boolean;
}

class ReaderScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const interval = setInterval(this.refreshWord, (1 * 60 * 1000) / props.initialSpeed);

    this.state = {
      currentParagraph: props.initialParagraph,
      currentParagraphIdx: props.initialIParagraphIdx,
      currentWordIdx: 0,
      currentSentenceIdx: 0,
      paragraphQueue: [],
      hasMoreParagraphs: true,
      interval,
      isStopped: false,
    };
  }

  refreshWord = () => {
    const {
      currentWordIdx,
      currentParagraph,
      currentParagraphIdx,
      currentSentenceIdx,
      paragraphQueue,
      hasMoreParagraphs,
      isStopped,
    } = this.state;
    const {
      loadNewParagraph,
    } = this.props;

    if (isStopped) {
      return;
    }

    const cParagraph = currentParagraph;
    let cHasMoreParagraphs = hasMoreParagraphs;

    const nextWordIdx = currentWordIdx + 1;
    const hasNextWord = cParagraph[currentSentenceIdx].length > nextWordIdx;

    const nextSentenceIdx = currentSentenceIdx + 1;
    const hasNextSentence = cParagraph.length > nextSentenceIdx;

    if (hasMoreParagraphs && !hasNextSentence && paragraphQueue.length === 0) {
      const nextParagraph = loadNewParagraph(currentParagraphIdx);

      if (nextParagraph.length === 0) {
        cHasMoreParagraphs = false;
      } else {
        paragraphQueue.push(nextParagraph);
      }
    }

    if (hasNextWord) {
      this.setState({
        hasMoreParagraphs: cHasMoreParagraphs,
        currentWordIdx: nextWordIdx,
        paragraphQueue,
      });

      return;
    }

    if (hasNextSentence) {
      this.setState({
        hasMoreParagraphs: cHasMoreParagraphs,
        currentWordIdx: 0,
        currentSentenceIdx: nextSentenceIdx,
        paragraphQueue,
      });

      return;
    }

    const cp = paragraphQueue.shift();

    this.setState({
      hasMoreParagraphs: cHasMoreParagraphs,
      currentWordIdx: 0,
      currentSentenceIdx: 0,
      paragraphQueue,
      currentParagraph: cp || [['End!']],
      currentParagraphIdx: currentParagraphIdx + 1,
    });

    if (!cp) {
      this.stop();
    }
  };

  stop = () => {
    const {
      interval,
    } = this.state;

    clearInterval(interval);

    this.setState({
      interval: null,
      isStopped: true,
    });
  };

  resume = (resetWords: boolean, resetSentence: boolean) => {
    const {
      initialSpeed,
    } = this.props;

    const interval = setInterval(this.refreshWord, (1 * 60 * 1000) / initialSpeed);

    this.setState((state) => ({
      interval,
      isStopped: false,
      currentSentenceIdx: resetSentence ? 0 : state.currentSentenceIdx,
      currentWordIdx: resetWords ? 0 : state.currentWordIdx,
    }));
  };

  render() {
    const {
      theme: { name },
      totalParagraphs,
    } = this.props;
    const {
      currentParagraph,
      currentWordIdx,
      currentSentenceIdx,
      isStopped,
      currentParagraphIdx,
    } = this.state;

    bem.useTheme(name);

    const $stoppedButtons = (
      <>
        <Button onClick={() => this.resume(false, false)}>Resume</Button>
        <Button onClick={() => this.resume(true, true)}>Resume from paragraph start</Button>
        <Button onClick={() => this.resume(true, false)}>Resume from sentence start</Button>
      </>
    );

    const $runningButtons = (
      <>
        <Button onClick={this.stop}>Stop</Button>
      </>
    );

    return (
      <div className={bem.block()}>
        <h1>{currentParagraph[currentSentenceIdx][currentWordIdx]}</h1>

        <div className={bem.element('additional-data')}>
          <p>
            Current paragraph:
            {currentParagraphIdx + 1}
            /
            {totalParagraphs}
          </p>
          <p>
            Current sentence:
            {currentSentenceIdx + 1}
            /
            {currentParagraph.length}
          </p>
          <p>
            Current word:
            {currentWordIdx + 1}
            /
            {currentParagraph[currentSentenceIdx].length}
          </p>
        </div>

        <div className={bem.element('buttons')}>
          {isStopped ? $stoppedButtons : $runningButtons}
        </div>
      </div>
    );
  }
}

export default withTheme(ReaderScreen);
