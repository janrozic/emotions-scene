import { Emotions, emotionTypes } from "helpers/types";
import { generateFunction } from "helpers/utils";
import React from "react";
import { mapValues, pick } from "lodash";

type Props = Emotions & {
  setEmotions: (e: Emotions) => void,
};
type State = {
  camera: boolean,
};
type Position = {
  top: number;
  left: number;
};

const distance = (a: Position, b: Position): number =>
  Math.sqrt(Math.pow(Math.abs(a.left - b.left), 2) + Math.pow(Math.abs(a.top - b.top), 2))
;

export default class EmotionPicker extends React.Component<Props, State> {
  state: State = {
    camera: false,
  };
  userRef = React.createRef<HTMLDivElement>();
  componentWillUnmount() {
    this.detachListeners();
  }
  toggleCamera = generateFunction(this, (camera: boolean) => {
    if (this.state.camera === camera) {
      return;
    }
    this.setState({camera}, () => {
      if (this.state.camera) {

      }
    });
  });
  detachListeners = () => {
    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("mouseup", this.detachListeners);
  };
  move = (e: MouseEvent) => {
    const holder = this.userRef.current;
    if (!holder) {
      return this.detachListeners();
    }
    const rect = holder.getBoundingClientRect();
    const top = Math.min(rect.height, Math.max(0, e.pageY - rect.top));
    const left = Math.min(rect.width, Math.max(0, e.pageX - rect.left));
    // console.log({left, top});
    const position: Position = {top, left};
    const emotionPositions: {[key in keyof Emotions]: Position} = {
      happy: {top: 0, left: rect.width / 2} ,
      sad: {top: rect.height, left: 0},
      angry: {top: rect.height, left: rect.width},
    }
    const maxDist = rect.width;
    const strengths: {[key in keyof Emotions]: number} = mapValues(emotionPositions,
      (pos) => 100*Math.min(1, Math.max(0, (maxDist - distance(pos, position)) / maxDist))
    );
    this.props.setEmotions(strengths);
    
  };
  get position(): Pick<React.CSSProperties, "top" | "left"> {
    const holder = this.userRef.current;
    if (!holder) {
      return {
        top: 0,
        left: 0,
      };
    }
    const rect = holder.getBoundingClientRect();
    const maxDist = rect.width;
    const top = Math.round(maxDist * (1 - this.props.happy/100)) + "px";
    const sum = this.props.sad/100 + this.props.angry/100;
    const left = Math.round(maxDist * (this.props.angry/100 / sum)) + "px";
    // console.log({top, left});
    return {top, left};
  }
  startDrag = () => {
    this.detachListeners();
    document.addEventListener("mousemove", this.move);
    document.addEventListener("mouseup", this.detachListeners);
  };
  get picker(): JSX.Element | null {
    if (this.state.camera) {
      return null;
    }
    return (
      <div className="user" onMouseDown={this.startDrag} ref={this.userRef}>
        <i style={this.position}></i>
      </div>
    );
  }
  get button(): JSX.Element {
    if (this.state.camera) {
      return (
        <button onClick={this.toggleCamera(false)}>Stop using camera</button>
      );
    }
    return (
      <button onClick={this.toggleCamera(true)}>Use camera for emotion detection</button>
    );
  }
  render() {
    if (this.state.camera) {
      return null;
    }
    return (
      <div className="emotions-picker">
        {this.button}
        {this.picker}
        <ul>
          {Object.entries(pick(this.props, emotionTypes)).map(([k, v]) => (<li key={k}>{k}: {v.toFixed(0)}</li>))}
        </ul>
      </div>
    );
  }
} 