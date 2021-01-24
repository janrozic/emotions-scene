import React from "react";
import color from "tinycolor2";

type Props = {
  color: string,
  color2?: string,
  angle: number,
  id: string,
};

function fromColor(c: string): string {
  return color(c).desaturate(40).toHexString();
}

const Gradient: React.FunctionComponent<Props> = (props) => (
  <linearGradient id={props.id} gradientTransform={"rotate(" + props.angle + ")"}>
    <stop offset="0%" stopColor={props.color} />
    <stop offset="100%" stopColor={props.color2 || fromColor(props.color)} />
  </linearGradient>
);

export default Gradient;
