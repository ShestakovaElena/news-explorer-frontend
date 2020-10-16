export default function renderKeywords(arr) {
  const countedKeywords = countKeywords(arr);
  if (countedKeywords.length === 1) {
    return `${countedKeywords[0][0]}`
  }
  else if (countedKeywords.length === 2) {
    return `${countedKeywords[0][0]} и ${countedKeywords[1][0]}`
  }
  else if (countedKeywords.length === 3){
    return `${countedKeywords[0][0]}, ${countedKeywords[1][0]} и ${countedKeywords[2][0]}`
  } else {
    return `${countedKeywords[0][0]}, ${countedKeywords[1][0]} и ${countedKeywords.length - 2} другим`
  }
}
function countKeywords(arr) {
  const keywords = {};
    arr.forEach(article => {
      if (keywords[article.keyword]) {
        keywords[article.keyword] += 1;
      } else {
        keywords[article.keyword] = 1;
      }
    });
    return Object.entries(keywords).sort((a, b) => b[1] - a[1]);
};