type Option = {
  id: number;
  name: string;
};
const translateWordList = [
  { src: '블랙', dest: '검정색' },
  { src: '레드', dest: '빨간색' },
];
const optionList = [
  { id: 1, name: '블랙 XL' },
  { id: 2, name: '블랙 L' },
  { id: 3, name: '블랙 M' },
  { id: 4, name: '레드 XL' },
  { id: 5, name: '레드 L' },
  { id: 6, name: '레드 M' },
];

const ruleMap = new Map();
for (const { src, dest } of translateWordList) {
  ruleMap.set(src, dest);
}

const updatedOptionList = optionList.map(({ id, name }) => {
  const [color, size] = name.split(' ');
  const foundRule = ruleMap.get(color);

  const translatedWord = foundRule
    ? `${foundRule} ${size}`
    : `${color}, ${size}`;
  return { id, name: translatedWord };
});

console.log(updatedOptionList);
