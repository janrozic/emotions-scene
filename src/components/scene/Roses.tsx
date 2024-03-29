import Flower from "components/helpers/Flower";
import Gradient from "components/helpers/Gradient";
import { randomRange } from "helpers/utils";
import { range } from "lodash";
import React from "react";
import color from "tinycolor2";

const q2 = (a: number) => Math.pow(a, 2);
const top = 35;

export default class Rose extends Flower {
  r = Math.round(randomRange(70, 700));
  stemradius = this.r;
  k = top + (100 - top) / 2;
  h = 50 + Math.sqrt(q2(this.r) - q2((100 - top) / 2));  // pitagora
  stemwidth = randomRange(4, 6);
  // derived for x from:
  //  (x-h)^2 + (y-k)^2 = r^2
  // quadratic equation (searching for the lower number)
  circleformula = (y: number) => this.h - Math.sqrt(-q2(this.k) + q2(this.r) + 2 * this.k * y - q2(y));
  sections = [2, 3, 4, 5];
  get top() {
    return top;
  }

  // get grouptransform() {
  //   return "translate(-125,0)";
  // }
  get green() {
    return color.mix(color("green"), color("gray"), this.props.sad).toHexString();
  }

  // FLOWER PETALS
  get petalPath() {
    return this.props.size([
      "M", 1 / 2, 0,
      "C", 1 / 2, 1 / 4, 1.1, 1, 1 / 2, 1,
      "S ", 1 / 8, 1 / 3, 1 / 2, 0,
      "Z",
    ], this.top).join(" ");
  }
  get red() {
    const rered = color.mix(color("red"), color("blue"), this.props.sad * 0.6);
    return color.mix(rered, color("black"), this.props.angry).toHexString();
  }
  get petals() {
    const feeling = 60 + this.props.happy * 0.4 - this.props.sad * 0.6;
    const rCenter = this.props.size([0.5, 0.75], this.top);
    const angles = [0, 0.3333, 0.666, 1]
      .map((a) => a * -1 * 0.8 * feeling)
    ;
    const side = angles.map((a) => "rotate(" + a + ", " + rCenter[0] + ", " + rCenter[1] + ")");
    const petals = [];
    for (let i = 0; i < side.length; i++) {
      const ii = side.length - i - 1;
      petals.push(
        {
          transform: side[i],
          stroke: this.red,
          fill: color.mix(this.red, color("white"), ii * 17).toHexString(),
        },
        {
          stroke: this.red,
          transform: "translate(" + this.props.size(this.top) + ",0) scale(-1, 1) " + side[i],
          fill: color.mix(this.red, color("white"), (ii + 0.5) * 17).toHexString(),
        },
      );
    }
    return petals;
  }

  // THORNS
  get thorn() {
    const x = 10 + this.props.angry / 10 - this.props.happy / 10;
    const y = x / 2;
    return "-" + x * this.props.size + "," + y / 2 * this.props.size + " " + 0 + ",0 " + 0 + "," + y * this.props.size;
  }
  get thorns(): JSX.Element[] {
    const fill = color.mix(
      color("green"),
      color.mix(color("black"), color("red")),
      Math.max(0, this.props.angry - this.props.happy)
    );
    // returns a function of render function that returns an array of thorns
    return this.sections.map((a, i) => {
      const y = this.section2y(a);
      const x = this.props.size(this.circleformula(y) + this.stemwidth * 0.25);
      return (
        <use
          key={"thorn" + i}
          href="#thorn-rose"
          xlinkHref="#thorn-rose"
          fill={fill.toHexString()}
          x={x}
          y={y * this.props.size}
          transform={a % 2 ? "scale(-1, 1) translate(" + (-2 * x) + ", 0)" : ""}
        />
      );
    });
  }

  // LEAVES
  get leaf() {
    const W = 30 - this.props.angry * 0.15;
    const thick = 10 + this.props.happy * 0.1;
    const drop = this.props.sad * thick * 0.01;
    return this.props.size([
      "M", 0, 0,
      // 'S', W, H, W, 0,
      "C", W / 2, 0, W, thick + drop / 2, W, drop,
      "Q", W, -(thick + drop / 2) * 0.6, 0, -W / 10,
      "Z",
    ]).join(" ");
  }
  get leaves(): JSX.Element[] {
    return this.sections.map((a, i) => {
      const y = this.section2y(a);
      const x = this.props.size(this.circleformula(y) + this.stemwidth * 0.75);
      return (
        <use
          key={"leaf" + i}
          href="#leaf-rose"
          xlinkHref="#leaf-rose"
          x={x}
          y={y * this.props.size}
          transform={a % 2 ? "scale(-1, 1) translate(" + (-2 * x) + ", 0)" : ""}
        />
      );
    });
  }
  get leaves2(): JSX.Element[] {
    return this.sections.map((a, i) => {
      const y = this.section2y(a);
      const x = this.props.size(this.circleformula(y) + this.stemwidth * 0.75);
      return (
        <use
          key={"leaf" + i}
          href="#leaf-rose"
          xlinkHref="#leaf-rose"
          x={x}
          y={y * this.props.size}
          transform={a % 2 ? "scale(-1, 1) translate(" + (-2 * x) + ", 0)" : ""}
        />
      );
    });
  }

  // STEM
  get stem() {
    return this.props.size([
      "M", 50, this.top,  // move to the top of stem arch (horizontal center of svg)
      "A", // outer arch
        this.stemradius, this.stemradius, 0, 0, 0, 50, 100,
      "l", this.stemwidth, 0,  // bottom cut
      "A", // inner arch (2.5 should be correctly calculated but why bother)
        this.stemradius - 2.5 * this.stemwidth, this.stemradius - 2.5 * this.stemwidth,
        0, 0, "1",
        50 + this.stemwidth, this.top,
      "L", 50, this.top, // back to start
    ]).join(" ");
  }

  render() {
    if (!this.props.size) {
      return null;
    }
    const renderedPetals = this.petals.map((attrs, i) => {
      return (
        <use key={"petal" + i} href="#petal-rose" xlinkHref="#petal-rose" {...attrs} />
      );
    });
    const defs = (
      <svg>
        <defs>
          <Gradient id="gradient-red-rose" angle={10} color={this.red} />
          <Gradient id="gradient-green-rose" angle={40} color={this.green} />
          {/* <mask id="mask-petal"><path d={this.petalPath} fill="white" /></mask>
          <mask id="mask-stem"><path d={this.stem} fill="white" /></mask>
          <mask id="mask-leaf"><path d={this.leaf} fill="white" /></mask> */}
          <path id="petal-rose" d={this.petalPath} fill="url(#gradient-red-rose)" />
          <path id="leaf-rose" d={this.leaf} fill="url(#gradient-green-rose)" />
          <polygon id="thorn-rose" points={this.thorn} />
        </defs>
      </svg>
    );
    const instances = range(0, this.props.count).map((st, i) => (
      <svg key={i} className="rose" width="250" height="300">
        <g filter="url(#shadow)">
          {this.thorns}
          {this.leaves}
          <path className="stem" d={this.stem} fill="url(#gradient-green-rose)" />
          <g transform={"translate(" + ((100 - this.top + this.stemwidth) * this.props.size / 2) + ", 0)"}>
            {renderedPetals}
          </g>
        </g>
      </svg>
    ));
    return (
      <>
        {defs}
        <div className="instances">{instances}</div>
      </>
    );
  }
}
