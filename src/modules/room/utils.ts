import { PointOptions } from '../../types';

enum PointingTypes {
  fibonacci = 'Fibonacci',
  tshirt = 'T-Shirt',
  sequential = 'Sequential',
  limitedFibonacci = 'Limited Fibonacci',
}

const getPointOptions = (type?: string): PointOptions => {
  switch (type) {
  case PointingTypes.fibonacci:
    return [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '∞'];
  case PointingTypes.tshirt:
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'];
  case PointingTypes.sequential:
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?'];
  case PointingTypes.limitedFibonacci:
  default:
    return [ 1, 2, 3, 5, 8, '?', '∞' ];
  }
};

export default getPointOptions;
export { PointingTypes };
