import { Emotions, emotionTypes } from "helpers/types";
import React from "react";
import color from 'tinycolor2';
import { pick } from 'lodash';

export default class Base<AdditionalProps = {}, State = {}> extends React.Component<Emotions & AdditionalProps, State> {
  get m_x() {
    return 0.5;
    // return this.mouse[0] / window.innerWidth - 0.5;
  }
  get m_y() {
    return 0.5;
    // return this.mouse[1] / window.innerHeight - 0.5;
  }
  get grass() {
    var shadow = 18;  //shadow feather in px
    var negative = Math.max(this.props.sad, this.props.angry);
    var inner = color.mix(color('#269401'), color('#454a43'), negative);
    var outer = color.mix(color('#6ea709'), color('#afafaf'), negative);
    return (left: string) =>
      'radial-gradient(farthest-side at ' + left + ' 150%, ' +
        inner + ', ' +
        outer + ' calc(100% - ' + (shadow + 1) + 'px), ' +
        'rgba(0, 0, 0, 0.4) calc(100% - ' + shadow + 'px), transparent 100%)'
      ;
  }
  get perspective() {
    return (c: number, side: "left" | "right") => {
      var t = [];
      var scale = 1 + (this.m_y - 0.5)/10;
      if (side === 'left') {
        scale += (0.5 - this.m_x)/10;
      } else if (side === 'right') {
        scale += (this.m_x - 0.5)/10;
      }
      t.push('scale(' + scale + ')');
      return t.join(' ');
    };
    //return (c) => 'translate(' + (-x*c) + '%, ' + (-y*c) + '%)';
  }
  get emotions(): Emotions {
    return pick(this.props, emotionTypes);
  }
}