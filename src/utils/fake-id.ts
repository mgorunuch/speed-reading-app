const IDS: { [key: string]: number } = {};

export const generateFakeID = (type: string): string => {
  if (!IDS[type]) {
    IDS[type] = 0;
  }

  return `${type}_${IDS[type]++}`;
};
