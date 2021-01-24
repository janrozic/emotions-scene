import { Emotions, emotionTypes } from "helpers/types";
import { generateFunction } from "helpers/utils";
import { mapValues, pick } from "lodash";
import React from "react";

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
        return;
      }
    });
  });
  detachListeners = () => {
    document.removeEventListener("mousemove", this.move);
    document.removeEventListener("mouseup", this.detachListeners);
  }
  get rect() {
    const holder = this.userRef.current;
    if (!holder) {
      this.detachListeners();
    }
    return holder?.getBoundingClientRect();
  }
  // get w(): number {
  //   return this.rect?.width || -1;
  // }
  get hCorrection(): number {
    if (!this.rect) {
      return 1;
    }
    return (this.rect.width * 0.866) / this.rect.height;
  }
  // get h(): number {
  //   return this.rect?.height || -1;
  // }
  move = (e: MouseEvent) => {
    const rect = this.rect;
    if (!rect) {
      return;
    }
    type EK = keyof Emotions;
    const w = rect.width;
    const h = w * 0.866;
    // translate to equal-sided triangle
    const hReal = rect.height;
    const hCorrection = this.hCorrection;
    const top = Math.min(hReal, Math.max(0, e.pageY - rect.top)) * hCorrection;
    const left = Math.min(w, Math.max(0, e.pageX - rect.left));
    // console.log({left, top, h, w});
    const position: Position = {top, left};
    const emotionPositions: {[key in EK]: Position} = {
      happy: {top: 0, left: w / 2} ,
      sad: {top: h, left: 0},
      angry: {top: h, left: w},
    };
    const maxDist = w;
    const strengths: {[key in EK]: number} = mapValues(emotionPositions,
      (pos) => 100 * Math.min(
        1,
        Math.max(
          0,
          (maxDist - distance(pos, position)) / maxDist
        )
      )
    );
    // console.log(strengths);
    this.props.setEmotions(strengths);
  }
  get position(): Pick<React.CSSProperties, "top" | "left"> {
    const rect = this.rect;
    if (!rect) {
      return {
        top: 0,
        left: 0,
      };
    }
    const w = rect.width;
    const h = w * 0.866;
    // r1, r2, r2: distances from top, left and right for equal-sided triangle (h = w * 0.866) maxR = w
    const r1 = (100 - this.props.happy) * (w / 100);
    const r2 = (100 - this.props.sad) * (w / 100);
    const r3 = (100 - this.props.angry) * (w / 100);
    const a = w / 2;
    const b = w * 0.866;
    // we use coordinate system where x=left, y=top, circle equations for top (a, 0) and left (0, b) corners
    // Wolfram Alpha
    // solve [//math:r1^2 = (x-a)^2 + y^2//],[//math: r2^2 = x^2 + (y-b)^2//] for [//math:x, y//]
    // tslint:disable-next-line: max-line-length whitespace
    const x = (a**3 + Math.sqrt(-(b**2)*(a**4 + 2*a**2*(b**2 - r1**2 - r2**2) + b**4 - 2*b**2*(r1**2 + r2**2) + (r1**2 - r2**2)**2)) + a*b**2 - a*r1**2 + a*r2**2)/(2*(a**2 + b**2));
    // tslint:disable-next-line: max-line-length whitespace
    const y = (a**2*b**2 + a*Math.sqrt(-(b**2)*(a**4 + 2*a**2*(b**2 - r1**2 - r2**2) + b**4 - 2*b**2*(r1**2 + r2**2) + (r1**2 - r2**2)**2)) + b**4 + b**2*r1**2 - b**2*r2**2)/(2*b*(a**2 + b**2));

    const top = y / this.hCorrection + "px";
    const left = x + "px";
    return {top, left};
  }
  startDrag = () => {
    this.detachListeners();
    document.addEventListener("mousemove", this.move);
    document.addEventListener("mouseup", this.detachListeners);
  }
  get picker(): JSX.Element | null {
    if (this.state.camera) {
      return null;
    }
    return (
      <div className="user" onMouseDown={this.startDrag} ref={this.userRef}>
        <i style={this.position} />
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
