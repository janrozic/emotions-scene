import { cloneDeep, noop, uniq } from "lodash";

const simpleHash = (s: string): string => {
  let hash = 0;
  let i;
  let chr;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    // tslint:disable-next-line: no-bitwise
    hash  = ((hash << 5) - hash) + chr;
    // tslint:disable-next-line: no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return String(hash);
};

type Evt = React.MouseEvent | React.ChangeEvent<any> | React.DragEvent<any> | React.FocusEvent | React.SyntheticEvent;

export function generateFunction<T1, R>(
  t: object,
  callable: (...args: [T1]) => R
): (
  ((...args: [T1]) =>
  ((...args: (
    [] |
    [Evt]
  )) => R))
);
export function generateFunction<T1, T2, R>(
  t: object,
  callable: (...args: [T1, T2]) => R
): (
  ((...args: [T1] | [T1, T2]) =>
  ((...args: (
    [T2] | [] |
    [T2, Evt] | [Evt]
  )) => R))
);
export function generateFunction<T1, T2, T3, R>(
  t: object,
  callable: (...args: [T1, T2, T3]) => R
): (
  ((...args: [T1] | [T1, T2] | [T1, T2, T3]) =>
  ((...args: (
    [T2, T3] | [T3] | [] |
    [T2, T3, Evt] | [T3, Evt] | [Evt]
  )) => R))
);
export function generateFunction<T1, T2, T3, T4, R>(
  t: object,
  callable: (...args: [T1, T2, T3, T4]) => R
): (
  ((...args: [T1] | [T1, T2] | [T1, T2, T3] | [T1, T2, T3, T4]) =>
  ((...args: (
    [T2, T3, T4] | [T3, T4] | [T4] | [] |
    [T2, T3, T4, Evt] | [T3, T4, Evt] | [T4, Evt] | [Evt]
  )) => R))
);
export function generateFunction<T1, T2, T3, T4, T5, R>(
  t: object,
  callable: (...args: [T1, T2, T3, T4, T5]) => R
): (
  ((...args: [T1] | [T1, T2] | [T1, T2, T3] | [T1, T2, T3, T4] | [T1, T2, T3, T4, T5]) =>
  ((...args: (
    [T2, T3, T4, T5] | [T3, T4, T5] | [T4, T5] | [T5] | [] |
    [T2, T3, T4, T5, Evt] | [T3, T4, T5, Evt] | [T4, T5, Evt] | [T5, Evt] | [Evt]
  )) => R))
);
export function generateFunction<T1, T2, T3, T4, T5, T6, R>(
  t: object,
  callable: (...args: [T1, T2, T3, T4, T5, T6]) => R
): (
  ((...args: [T1] | [T1, T2] | [T1, T2, T3] | [T1, T2, T3, T4] | [T1, T2, T3, T4, T5] | [T1, T2, T3, T4, T5, T6]) =>
  ((...args: (
    [T2, T3, T4, T5, T6] | [T3, T4, T5, T6] | [T4, T5, T6] | [T5, T6] | [T6] | [] |
    [T2, T3, T4, T5, T6, Evt] | [T3, T4, T5, T6, Evt] | [T4, T5, T6, Evt] | [T5, T6, Evt] | [T6, Evt] | [Evt]
  )) => R))
);
export function generateFunction(holder: object, callable: (...args: any[]) => any) {
  const key = callable.name || simpleHash(callable.toString());
  if (!(holder as any).hasOwnProperty(key)) {
    (holder as any)[key] = {};
  }
  const functionRepo = (holder as any)[key];
  return (...params: any[]) => {
    const tkey = params.map((p) => JSON.stringify(p)).join(",");
    if (!functionRepo.hasOwnProperty(tkey)) {
      functionRepo[tkey] = (...args2: any[]) => callable(...params, ...args2);
    }
    return functionRepo[tkey];
  };
}

export function cacheTransformed<T1, R>(
  t: object,
  transformFunction: ((...args: [T1]) => R)
): ((...args: [T1]) => R);
export function cacheTransformed<T1, T2, R>(
  t: object,
  transformFunction: ((...args: [T1, T2]) => R)
): ((...args: [T1, T2]) => R);
export function cacheTransformed<T1, T2, T3, R>(
  t: object,
  transformFunction: ((...args: [T1, T2, T3]) => R)
): ((...args: [T1, T2, T3]) => R);
export function cacheTransformed<T1, T2, T3, T4, R>(
  t: object,
  transformFunction: ((...args: [T1, T2, T3, T4]) => R)
): ((...args: [T1, T2, T3, T4]) => R);
export function cacheTransformed(holder: object, transformFunction: ((...args: any[]) => any)) {
  const key = transformFunction.name || simpleHash(transformFunction.toString());
  type Repo = {
    o: any[][],
    t: any[],
  };
  if (!(holder as any).hasOwnProperty(key)) {
    (holder as any)[key] = {o: new Array(transformFunction.length).fill([]), t: []};
  }
  const functionRepo = (holder as any)[key] as Repo;
  return (...params: any[]) => {
    let index = -1;
    search: for (let i = 0; i < functionRepo.t.length; i++) {
      const collection = functionRepo.o[i] || [];
      if (collection.length !== params.length) {
        continue;
      }
      for (let j = 0; j < params.length; j++) {
        if (collection[j] !== params[j]) {
          continue search;
        }
      }
      index = i;
      break;
    }
    if (index === -1) {
      index = functionRepo.o.length;
      functionRepo.o[index] = [...params];
      functionRepo.t[index] = transformFunction(...params);
    }
    return functionRepo.t[index];
  };
}

export function functionKey(e: React.KeyboardEvent | KeyboardEvent) {
  const up = e.keyCode === 38 || e.key?.toLowerCase() === "arrowup";
  const down = e.keyCode === 40 || e.key?.toLowerCase() === "arrowdown";
  const left = e.keyCode === 37 || e.key?.toLowerCase() === "arrowleft";
  const right = e.keyCode === 39 || e.key?.toLowerCase() === "arrowright";
  const enter = e.keyCode === 13 || e.key?.toLowerCase() === "enter";
  const backspace = e.keyCode === 8 || e.key?.toLowerCase() === "backspace";
  const esc = e.keyCode === 27 || e.key?.toLowerCase() === "escape";
  const pageUp = e.keyCode === 33 || e.key?.toLowerCase() === "pageup";
  const pageDown = e.keyCode === 34 || e.key?.toLowerCase() === "pagedown";
  const tab = e.keyCode === 9 || e.key?.toLowerCase() === "tab";
  const ctrl = e.ctrlKey;
  const shift = e.shiftKey;
  return {up, down, left, right, enter, backspace, esc, pageUp, pageDown, ctrl, tab, shift};
}

type SimpleArray = Array<number | string | boolean>;
export function arraysAreEqual(a: SimpleArray | undefined, b: SimpleArray | undefined): boolean {
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "undefined" || typeof b === "undefined") {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (const i of a) {
    if (!b.includes(i)) {
      return false;
    }
  }
  return true;
}

export function getScrollParent(node: Element | null): Element | null {
  if (node == null) {
    return null;
  }
  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    const p = node.parentElement;
    return getScrollParent(p);
  }
}

export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;