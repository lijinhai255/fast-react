/*
 * @@description: 答题自定义枚举
 */
export type optionsType = {
  value: number;
  label: string;
  answer?: string;
  correctAnswer?: string;
}[];
export const optionsArr: optionsType = [
  { value: 1, label: 'A' },
  { value: 2, label: 'B' },
  { value: 3, label: 'C' },
  { value: 4, label: 'D' },
  { value: 5, label: 'E' },
  { value: 6, label: 'F' },
  { value: 7, label: 'G' },
  { value: 8, label: 'H' },
];

export const defaultList: optionsType = [
  { value: 1, label: 'A' },
  { value: 2, label: 'B' },
  { value: 3, label: 'C' },
  { value: 4, label: 'D' },
];

export const trueOfFalseList: optionsType = [
  { value: 1, label: 'A' },
  { value: 2, label: 'B' },
];
