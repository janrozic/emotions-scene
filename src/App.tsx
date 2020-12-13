import React from 'react';
import logo from './logo.svg';
import 'App.scss';
import EmotionPicker from 'components/helpers/EmotionPicker';
import { Emotions, emotionTypes } from 'helpers/types';
import Weather from 'components/scene/Weather';
import Garden from 'components/scene/Garden';

type State = Emotions;

export default class App extends React.Component<{}, State> {
  state: State = {
    sad: 0,
    happy: 1,
    angry: 0,
  };
  setEmotions = (emotions: Emotions) => {
    const changed: Partial<State> = {};
    for (const type of emotionTypes) {
      if (Math.abs(emotions[type] - this.state[type]) > 5) {
        changed[type] = emotions[type];
      }
    }
    if (Object.keys(changed).length) {
      this.setState(changed as NonNullable<State>);
    }
  }
  get emotions(): Emotions{
    return this.state;
  }
  render () {
    return (
      <main className="app">
        <Weather {...this.emotions} />
        <div className="foreground">
          {/* <House {...this.emotions} /> */}
          <Garden {...this.emotions} />
        </div>
        <EmotionPicker {...this.emotions} setEmotions={this.setEmotions} />
      </main>
    );
  }
}