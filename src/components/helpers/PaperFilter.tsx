import React from "react";

type Props = {
  color: string,
  angle: number,
  id: string,
};

const PaperFilter: React.FunctionComponent<Props> = (props) => (
  <filter id={props.id} x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="5" />
    <feDiffuseLighting in="noise" lighting-color={props.color} surfaceScale="2">
      <feDistantLight azimuth="90" elevation={String(Math.min(180, Math.max(0, props.angle)))} />
    </feDiffuseLighting>
  </filter>
);

export default PaperFilter;
