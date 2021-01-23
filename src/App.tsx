import "App.scss";
import EmotionPicker from "components/helpers/EmotionPicker";
import Garden from "components/scene/Garden";
import House from "components/scene/House";
import Weather from "components/scene/Weather";
import { Emotions, emotionTypes } from "helpers/types";
import React from "react";

type State = Emotions & {size: any};

export default class App extends React.Component<{}, State> {
  state: State = {
    sad: 1,
    happy: 100,
    angry: 1,
    size: false,
  };
  resize = () => {
    const size = function(v: string | number | Array<string | number>, a: number): string | number | string[] {
      a = a || 1;
      if (Array.isArray(v)) {
        return v.map((m) => String(size(m, a)));
      } else if (typeof v === "number") {
        return v * (size as any).n * a;
      } else {
        return v;
      }
    };
    (size as any)[Symbol.toPrimitive] = function(hint: string) {
      return hint === "string" ? this.n.toFixed(2) : this.n;
    };
    const minsize = Math.min(window.innerWidth, window.innerHeight);
    size.n = minsize / 250;
    this.setState({
      size,
    });
  }
  componentDidMount() {
    document.addEventListener("resize", this.resize);
    this.resize();
  }
  componentWillUnmount() {
    document.removeEventListener("resize", this.resize);
  }
  setEmotions = (emotions: Emotions) => {
    const changed: Partial<State> = {};
    for (const type of emotionTypes) {
      if (Math.abs(emotions[type] - this.state[type]) > 1) {
        changed[type] = emotions[type];
      }
    }
    if (Object.keys(changed).length) {
      this.setState(changed as NonNullable<State>);
    }
  }
  get emotions(): Emotions {
    return this.state;
  }
  render() {
    return (
      <main className="app">
        <Weather {...this.emotions} />
        <div className="foreground">
          {/* <House {...this.emotions} /> */}
          <Garden {...this.emotions} size={this.state.size} />
          <House {...this.emotions} size={this.state.size} setEmotions={this.setEmotions} />
        </div>
      </main>
    );
  }
}
