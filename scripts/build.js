const path = require('path');
const fs = require('fs');

const allFiles = fs.readdirSync('./');
allFiles.sort();

const isImage = file => path.extname(file) === '.jpg';
const generateOrgList = (file) => {
  const fname = path.parse(file).name;
  const caption = fname.replace(/_/g, ' ');

  return [
    //`** ${caption}`,
    `#+CAPTION: ${caption}`,
    '#+ATTR_HTML: :width 300px',
    `[[file:${file}]]`,
    '',
  ].join('\n');
}

const orgList = allFiles
  .filter(isImage)
  .map(generateOrgList)

const fileHeader = [
  '#+title: Plant Gallery',
  '#+OPTIONS: author:nil timestamp:nil',
  '',
]

const fileContext = [...fileHeader, ...orgList];

fs.writeFileSync('index.org', fileContext.join('\n'));
