import SceneItem from "./SceneItem";

type StyleProps = {
  styles: React.CSSProperties,
}
type State = {
  size: any,
};

export default class Flower extends SceneItem<StyleProps, State> {
  state: State = {
    size: false,
  }
  sections: number[] = [];
  size = false;
  flip = Math.random() > 0.5;
  get top() {return 0;}
  resize = () => {
    const size = function (v: string | number | Array<string | number>, a: number): string | number | string[] {
      a= a || 1;
      if (Array.isArray(v)) {
        return v.map(m => String(size(m, a)));
      } else if (typeof v === 'number') {
        return v * (size as any).n * a;
      } else {
        return v;
      }
    };
    (size as any)[Symbol.toPrimitive] = function (hint: string) {
      return hint === "string" ? this.n.toFixed(2) : this.n;
    };
    var minsize = Math.min(window.innerWidth, window.innerHeight);
    size.n = minsize / 250;
    this.setState({
      size,
    });
  }
  componentDidMount() {
    document.addEventListener("resize", this.resize);
    this.resize();
  }
  componentWillUnmount() {
    document.removeEventListener("resize", this.resize);
  }
  get section2y() {
    return (a: number) => {
      var max = Math.max.apply(null, this.sections);
      return this.top + (max - a + 1)*(100 - this.top)/(max + 1);
    };
  }
}