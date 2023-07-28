interface color {
  red: number;
  blue: number;
  green: number;
}

const color2 = (): color => {
  return {
    red: 10,
    blue: 30,
    green: 80,
  };
};

export default color2;
