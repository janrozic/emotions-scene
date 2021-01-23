import Gradient from "components/helpers/Gradient";
import PaperFilter from "components/helpers/PaperFilter";
import SceneItem from "components/helpers/SceneItem";
import { randomRange } from "helpers/utils";
import { range } from "lodash";
import React from "react";
import Daisies from "./Daisies";
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
        <div
          id="garden"
          // style={{background: this.grass("0%"), transform: this.perspective(25, "left")}}
        >
          <svg viewBox="0 0 5 2" preserveAspectRatio="none">
            <defs>
              <Gradient id="gradient-garden" angle={40} color={"green"} />
            </defs>
            <path d="M 0 2 L 5 2 C 3 2 3 0 0 0" fill="url(#gradient-garden)" />
          </svg>
          <div className="daisies">
            <Daisies {...this.emotions} count={4} size={this.props.size} />
          </div>
          <div className="roses">
            <Roses {...this.emotions} count={4} size={this.props.size} />
          </div>
        </div>
      </>
    );
  }
}
