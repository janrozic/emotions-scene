import Flower from "components/helpers/Flower";
import { randomRange } from "helpers/utils";
import React from "react";
import color from "tinycolor2";

type Coord = "x" | "y";

export default class Fern extends Flower {
  sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  curvature = randomRange(-20, 20);
  randomcoef = randomRange(0.8, 1.2);
  get top() {
    return Math.max(0, 20 + this.props.sad * 0.15 - this.props.angry * 0.15) * this.randomcoef;
  }
  get leafouter() {
    const base = 20;
    return {
      stem: this.state.size * base * 0.1,
      cx: this.state.size * base * 0.67,
      rx: this.state.size * base * 0.33,
      ry: this.state.size * base * 0.33 * 0.5,
    };
  }
  get leafinner() {
    const coef = 0.7 * this.randomcoef;
    return  {
      cx: this.leafouter.cx,
      rx: this.leafouter.rx * coef,
      ry: this.leafouter.ry * coef,
    };
  }
  get green() {
    return color.mix(color("green"), color("gray"), this.props.sad).toHexString();
  }
  get orange() {
    return color.mix(color.mix(color("yellow"), this.green), color("red"), this.props.angry).toHexString();
  }
  get points() {
    // negative correction -> straighter stem
    let correction = this.curvature + this.props.sad * 0.2 - this.props.angry * 0.2;
    correction = Math.max(-12.5, Math.min(25, correction));
    return [
      [50, 0],
      [25 + correction, 25],
      [75 - correction, 50],
      [50, 100],
    ].map((p) => ([p[0], this.top + (p[1] * (100 - this.top) / 100)])); // shrink to keep top padding
  }
  get bezier() {
    const P = (p: Coord, n: number) => this.points[n - 1][p === "x" ? 0 : 1];
    return (t: number) => {
      // formula from https://javascript.info/bezier-curve
      t = Math.min(1, Math.max(0, t));  // t runs from 0 to 1
      const coord = (p: Coord) =>
        Math.pow(1 - t, 3) * P(p, 1) +
        3 * Math.pow(1 - t, 2) * t * P(p, 2) +
        3 * (1 - t) * t * t * P(p, 3) +
        t * t * t * P(p, 4)
      ;
      return {
        x: coord("x") * this.state.size,
        y: coord("y") * this.state.size,
      };
    };
  }
  get leafs() {
    const max = Math.max.apply(null, this.sections) + 2;
    const points = this.sections.map((s) => this.bezier((max - s) / max));
    const angles: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      angles.push(-Math.atan(dx / dy) * 180 / Math.PI * 0.7);
    }
    angles.push(angles[angles.length - 1]); // copy the last angle
    return points.map((p, i) => ({
      ...p,
      transform: "rotate(" + (angles[i] + (i % 2 ? 0 : 180)) + " " + p.x + " " + p.y + ")"
    }));
  }
  get stem() {
    return this.state.size([
      "M", ...this.points[0],
      "C", ...this.points[1], ...this.points[2], ...this.points[3],
    ]).join(" ");
  }
  get transform() {
    if (this.size && this.flip) {
      return "scale(-1,1) translate(" + this.state.size(-100) + ",0)";
    }
    return "";
  }
  render() {
    if (!this.state.size) {
      return null;
    }
    const leafs = this.leafs.map((point, i) => (
      <use key={"l" + i} href="#fernleaf" xlinkHref="#fernleaf" x={point.x} y={point.y} transform={point.transform} />
    ));
    return (
      <svg className="fern" width={this.state.size * 100} height={this.state.size * 100}>
        <defs>
          <g id="fernleaf">
            <line x1="0" y1="0" x2={this.leafouter.cx} y2="0" stroke={this.green} strokeWidth={this.leafouter.stem} />
            <ellipse cx={this.leafouter.cx} cy="0" rx={this.leafouter.rx} ry={this.leafouter.ry} fill={this.green} />
            <ellipse cx={this.leafinner.cx} cy="0" rx={this.leafinner.rx} ry={this.leafinner.ry} fill={this.orange} />
          </g>
        </defs>
        <g filter="url(#shadow)" transform={this.transform}>
          <path
            className="stem"
            d={this.stem}
            stroke={this.green}
            fill="none"
            strokeWidth={this.state.size * 4}
          />
          {leafs}
          <circle
            cx={this.state.size * this.points[0][0]}
            cy={this.state.size * this.points[0][1]}
            r={Math.min(this.top / 2, 7) * this.state.size * this.randomcoef}
            fill={this.orange}
          />
        </g>
      </svg>
    );
  }
}