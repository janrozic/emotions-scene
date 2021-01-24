import Flower from "components/helpers/Flower";
import Gradient from "components/helpers/Gradient";
import { generateFunction, modulate, randomRange } from "helpers/utils";
import { range } from "lodash";
import React from "react";
import color from "tinycolor2";

type Coord = "x" | "y";

export default class Daisies extends Flower {
  sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  curvatures = this.sections.map(() => randomRange(-20, 20));
  randomcoef = this.sections.map(() => randomRange(0.8, 1.2));
  get tops() {
    const emot = Math.max(0, 20 + this.props.sad * 0.15 - this.props.angry * 0.15);
    return this.randomcoef.map((c) => c * emot);
  }
  get leafouter() {
    const base = 20;
    return {
      stem: this.props.size * base * 0.1,
      cx: this.props.size * base * 0.67,
      rx: this.props.size * base * 0.33,
      ry: this.props.size * base * 0.33 * 0.5,
    };
  }
  get leafinner() {
    const coef = 0.8;
    // const coef = 0.7 * this.randomcoef;
    return  {
      cx: this.leafouter.cx,
      rx: this.leafouter.rx * coef,
      ry: this.leafouter.ry * coef,
    };
  }
  get green() {
    return color.mix(color("green"), color("gray"), this.props.sad).toHexString();
  }
  get white() {
    const base = color.mix(color("blue"), color("lightgray"), this.props.sad);
    return color.mix(base, color("darkred"), this.props.angry).toHexString();
  }
  get orange() {
    return color.mix(color.mix(color("yellow"), this.green), color("red"), this.props.angry).toHexString();
  }
  get pointss(): number[][][] {
    // negative correction -> straighter stem
    return this.curvatures.map((curvature, i) => {
      let correction = curvature + this.props.sad * 0.2 - this.props.angry * 0.2;
      correction = Math.max(-12.5, Math.min(25, correction));
      return [
        [50, 0],
        [25 + correction, 25],
        [75 - correction, 50],
        [50, 100],
      ].map((p) => ([p[0], this.tops[i] + (p[1] * (100 - this.tops[i]) / 100)])); // shrink to keep top padding
    });
  }
  get beziers() {
    return this.pointss.map((points) => {
      const P = (p: Coord, n: number) => points[n - 1][p === "x" ? 0 : 1];
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
          x: coord("x") * this.props.size,
          y: coord("y") * this.props.size,
        };
      };
    });
  }
  get leafss() {
    return this.beziers.map((bezier) => {
      const max = Math.max.apply(null, this.sections) + 2;
      const points = this.sections.map((s) => bezier((max - s) / max));
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
    });
  }
  get stems() {
    return this.pointss.map((points) => {
      return this.props.size([
        "M", ...points[0],
        "C", ...points[1], ...points[2], ...points[3],
      ]).join(" ");
    });
  }
  flowerSizeCoef = 2.5;
  get petalPath(): string[] {
    const s = (n: number) => String(this.props.size(n * this.flowerSizeCoef));
    const a = this.props.angry;
    const top = modulate(4, 2, this.props.sad);
    const d = [
      "M 0 0",
      "A 1 1 0 0 0 0 " + s(6),
      "C", s(2), s(6), s(modulate(top, top / 2, a)), s(modulate(5, top, a)), s(top), s(3),
      "C", s(modulate(top, top / 2, a)), s(modulate(1, 2, a)), s(top / 2), "0 0 0",
    ];
    return d;
  }
  makePetal = generateFunction(this, (max: number, i: number, _: number, __: number[]): JSX.Element => {
    const s = (n: number) => String(this.props.size(n * this.flowerSizeCoef));
    const rotation = 360 / max;
    return (
      <use
        key={i}
        href="#daisy-petal"
        xlinkHref="#daisy-petal"
        transform={"rotate(" + (rotation * i) + " " + s(-4) + " " + s(2) + " )"}
      />
    );
  });
  render() {
    if (!this.props.size) {
      return null;
    }
    const defs = (
      <svg>
        <defs>
          <Gradient id="gradient-orange-daisy" angle={40} color={this.orange} />
          <Gradient id="gradient-green-daisy" angle={40} color={this.green} />
          <Gradient id="gradient-white-daisy" angle={90} color={this.white} />
          {/* <mask id="mask-outerleaf-daisy">
            <ellipse cx={this.leafouter.cx} cy="0" rx={this.leafouter.rx} ry={this.leafouter.ry} fill="white" />
          </mask>
          <mask id="mask-innerleaf-daisy">
            <ellipse cx={this.leafouter.cx} cy="0" rx={this.leafouter.rx} ry={this.leafouter.ry} fill="white" />
          </mask>
          <mask id="mask-leafstem-daisy">
            <line x1="0" y1="0" x2={this.leafouter.cx} y2="0" strokeWidth={this.leafouter.stem} fill="white" />
          </mask> */}
          <g id="daisyleaf">
            <line
              x1="0"
              y1="0"
              x2={this.leafouter.cx}
              y2="0"
              strokeWidth={this.leafouter.stem}
              stroke={this.green}
              // mask="url(#mask-leafstem-daisy)"
            />
            <ellipse
              cx={this.leafouter.cx}
              cy="0"
              rx={this.leafouter.rx}
              ry={this.leafouter.ry}
              fill="url(#gradient-green-daisy)"
              // mask="url(#mask-outerleaf-daisy)"
            />
            <ellipse
              cx={this.leafinner.cx}
              cy="0"
              rx={this.leafinner.rx}
              ry={this.leafinner.ry}
              fill="url(#gradient-orange-daisy)"
              // mask="url(#mask-innerleaf-daisy)"
            />
          </g>
          <path id="daisy-petal" d={this.petalPath.join(" ")} fill="url(#gradient-white-daisy)" />
          <g id="daisy-petals">
            {range(0, 6).map(this.makePetal(6))}
          </g>
        </defs>
      </svg>
    );
    const instances = range(0, this.props.count).map((st, i) => {
      const leafs = this.leafss[i].map((point, il) => (
        <use
          key={"l" + il}
          href="#daisyleaf"
          xlinkHref="#daisyleaf"
          x={point.x}
          y={point.y}
          transform={point.transform}
        />
      ));
      return (
        <svg key={i} className="daisy" width={this.props.size * 100} height={this.props.size * 100}>
          <g filter="url(#shadow)">
            <path
              className="stem"
              d={this.stems[i]}
              stroke={this.green}
              fill="none"
              strokeWidth={this.props.size * 4}
            />
            {leafs}
            <use
              href="#daisy-petals"
              xlinkHref="#daisy-petals"
              x={this.props.size(this.pointss[i][0][0] + 4 * this.flowerSizeCoef)}
              y={this.props.size(this.pointss[i][0][1] - 2 * this.flowerSizeCoef)}
            />
            <circle
              cx={this.props.size(this.pointss[i][0][0])}
              cy={this.props.size(this.pointss[i][0][1])}
              r={Math.min(this.tops[i] / 2, 7) * this.props.size * this.randomcoef[i]}
              fill={this.orange}
            />
          </g>
        </svg>
      );
    });
    return (
      <>
        {defs}
        <div className="instances">{instances}</div>
      </>
    );
  }
}
