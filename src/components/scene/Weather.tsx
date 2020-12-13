import { Emotions } from "helpers/types";
import React from "react";
import color from 'tinycolor2';

type Props = Emotions;

const seaHeight = 1000;
const lines: number[] = [];
for (let x = 0; x < seaHeight; x = x*1.5+5) {
  lines.push(x);
}

export default class Weather extends React.Component<Props> {
  get background(): React.CSSProperties {
    return {
      background: color.mix(
        color.mix(color('skyblue'), color('darkgray'), this.props.sad),
        color('purple'),
        this.props.angry
      ).toHexString(),
    };
  }
  get sun(): React.CSSProperties {
    var size = 7 + this.props.happy * 0.05 - this.props.sad * 0.04;
    var background = color.mix(color('#ffd600'), color('white'), this.props.sad);
    var shadows = [[
      0, 0, '1px', (size * 0.3) + 'vw', background.clone().setAlpha(0.5)
    ], [
      0, 0, '1px', (size * 0.7) + 'vw', background.clone().setAlpha(0.2)
    ]].map(s => s.join(' '));
    var top = 25 + (this.props.sad - this.props.happy) * 0.25;
    return {
      width: size + 'vw',
      height: size + 'vw',
      background: background.toHexString(),
      boxShadow: shadows.join(','),
      top: top + '%',
    };
  }
  get wavesscale (): number {
    return 10 + this.props.angry * 0.8;
  }
  render() {
    const rects = lines.map((l, i) => (
      <rect key={i} x="0" y={l} width="40" height="100" fill="url('#wave')" />
    ));
    return (
      <div className="weather" style={this.background}>
        <div className="sun" style={this.sun}></div>
        <svg className="sea" width="0" height="0">
          <defs>
            <linearGradient id="wave" gradientTransform="rotate(90)">
              <stop offset="0"  stopColor="#077dc1" />
              <stop offset="20%" stopColor="#046f9a" />
            </linearGradient>
            <pattern id="lines" patternUnits="userSpaceOnUse" width="40" height={seaHeight}>
              {rects}
            </pattern>
            <filter id="waterripple">
              {/* <feTurbulence type="fractalNoise" baseFrequency="0.0001 0.07" numOctaves="5" result="warp"></feTurbulence> */}
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" numOctaves="1" result="warp"></feTurbulence>
              <feColorMatrix in="warp" result="A" type="hueRotate" values="80.8672">
                <animate attributeType="XML" attributeName="values" values="0;180;360" dur="1s" repeatCount="indefinite"></animate>
              </feColorMatrix>
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale={this.wavesscale} in="SourceGraphic" in2="A"></feDisplacementMap>
            </filter>
          </defs>
          <rect x="0" y="5" width="0" height="0" fill="url(#lines)" filter="url(#_waterripple)" />
        </svg>
      </div>
    );
  }
} 