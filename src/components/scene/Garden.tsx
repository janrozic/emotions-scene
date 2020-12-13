import PaperFilter from "components/helpers/PaperFilter";
import SceneItem from "components/helpers/SceneItem";
import { randomRange } from "helpers/utils";
import { range } from "lodash";
import React from "react";
import Ferns from "./Ferns";
import Roses from "./Roses";

const flowersCount = 4;
type TransformKeys = "translateX" | "translateY" | "rotate" | "scale";
const basetransforms = range(0, 2 * flowersCount).map((j): {[key in TransformKeys]: number} => {
  let icos: number;
  if (j % 2 || 1) {
    icos = Math.cos(0.5 * Math.PI * j / (2 * flowersCount - 1));
  } else {
    icos = Math.sin(Math.PI * j / (2 * flowersCount - 1));
  }
  const rotation = 15;
  return {
    translateX: randomRange(0, 30) - 60 - j * 10,
    translateY: -Math.min(100 * icos, Math.max(0, (50 * icos + (Math.random() - 0.6) * 80))),
    rotate: j * (rotation / (flowersCount * 2)) - rotation + randomRange(0, 20) - 10,
    scale: 1 - (0.1 * icos + Math.random() * 0.8),
  };
});

export default class Garden extends SceneItem {
  get styles(): React.CSSProperties[] {
    const xs = basetransforms.map((v) => v.translateY);
    xs.sort((a, b) => a - b);
    return basetransforms.map((t) => ({
      "transform": (Object.keys(t) as TransformKeys[]).map((prop) => {
        let unit = "";
        let tt = t[prop];
        if (prop === "rotate") {
          unit = "deg";
        } else if (prop === "translateX") {
          tt += (1 + t.translateY / 100) * 20 * (0.5 - this.m_x);
          unit = "%";
        } else if (prop === "translateY") {
          tt += (1 + t.translateY / 100) * 20 * (0.5 - this.m_y);
          unit = "%";
        }
        return prop + "(" + tt.toFixed(2) + unit + ")";
      }).join(" "),
      "z-index": xs.indexOf(t.translateY) + 1,
    }));
  }
  render() {
    // const renderedFlowers = range(0, flowersCount).map((i) => (
    //   <React.Fragment key={i}>
    //     <Fern styles={this.styles} {...this.emotions} />
    //     <Rose styles={this.styles} {...this.emotions} />
    //   </React.Fragment>
    // ));
    return (
      <>
        <svg>
          <defs>
            <filter id="shadow">
              <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation={this.props.size * 3} />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
        </svg>
        <div id="garden" style={{background: this.grass("0%"), transform: this.perspective(25, "left")}}>
          <Ferns styles={this.styles} {...this.emotions} size={this.props.size} />
          <Roses styles={this.styles} {...this.emotions} size={this.props.size} />
        </div>
      </>
    );
  }
}
