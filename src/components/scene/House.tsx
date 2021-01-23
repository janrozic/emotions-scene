import EmotionPicker from "components/helpers/EmotionPicker";
import { Emotions, emotionTypes } from "helpers/types";
import SceneItem from "components/helpers/SceneItem";
import React from "react";
import color from "tinycolor2";

type Props = {
  setEmotions: (e: Emotions) => void,
};

export default class House extends SceneItem<Props> {
  get white(): string {
    return color.mix(color("white"), color("gray"), this.props.angry).toHexString();
  }
  get window(): JSX.Element {
    return (<div className="window" />);
  }
  get roof(): JSX.Element {
    return (<div className="roof" />);
  }
  render() {
    return (
      <div id="house" style={{background: this.white}}>
        <div className="door" />
        {this.window}
        {this.window}
        <div className="roof">
          <EmotionPicker {...this.emotions} setEmotions={this.props.setEmotions} />
          happy
          sad
          angry
        </div>
      </div>
    );
  }
}
