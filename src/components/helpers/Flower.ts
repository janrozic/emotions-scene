import SceneItem from "./SceneItem";

type FlowerProps = {
  count: number,
};

export default class Flower extends SceneItem<FlowerProps> {
  sections: number[] = [];
  size = false;
  flip = Math.random() > 0.5;
  get tops(): number[] {return new Array(this.sections.length).fill(0); }
  get section2y() {
    return (a: number) => {
      const max = Math.max.apply(null, this.sections);
      return this.tops[0] + (max - a + 1) * (100 - this.tops[0]) / (max + 1);
    };
  }
}
