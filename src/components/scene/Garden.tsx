import PaperFilter from "components/helpers/PaperFilter";
import SceneItem from "components/helpers/SceneItem";
import { randomRange } from "helpers/utils";
import { range } from "lodash";
import React from "react";
import Ferns from "./Ferns";
import Roses from "./Roses";

export default class Garden extends SceneItem {
  
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
          <Ferns {...this.emotions} count={4} size={this.props.size} />
          <Roses {...this.emotions} count={4} size={this.props.size} />
        </div>
      </>
    );
  }
}
