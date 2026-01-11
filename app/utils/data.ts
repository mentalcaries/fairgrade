export const HOSPITALS = [
  'San Fernando General Hospital',
  'Port of Spain General Hospital',
  "Mount Hope Women's Hospital",
  'Sangre Grande Hospital',
] as const;

export type Hospital = (typeof HOSPITALS)[number];
