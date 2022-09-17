type Falsy = false | 0 | "" | null | undefined;

export const isTruthy = <T>(x: T | Falsy): x is T => !!x;

export const isNotEmpty = <T>(value: T | null | undefined): value is T => {
  return value != null;
};
