import SceneItem from "./SceneItem";

type StyleProps = {
  styles: React.CSSProperties[],
};

export default class Flower extends SceneItem<StyleProps> {
  sections: number[] = [];
  size = false;
  flip = Math.random() > 0.5;
  get top() {return 0; }
  get section2y() {
    return (a: number) => {
      const max = Math.max.apply(null, this.sections);
      return this.top + (max - a + 1) * (100 - this.top) / (max + 1);
    };
  }
}
