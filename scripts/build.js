const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");

const allFiles = fs.readdirSync('./');
allFiles.sort();

const isImage = file => path.extname(file) === '.jpg';
const generateOrgList = (file) => {
  const fname = path.parse(file).name;
  const caption = fname.replace(/_/g, ' ');

  return [
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
  '#+OPTIONS: author:nil timestamp:nil toc:nil',
  '#+HTML_HEAD: <style type="text/css">',
  '#+HTML_HEAD: .outline-2 h2 {display:none;} .outline-text-2 {column-count:2;}',
  '#+HTML_HEAD: </style>',
  '',
  '* All Plants',
]

const fileContext = [...fileHeader, ...orgList];

// Create index.org
fs.writeFileSync('index.org', fileContext.join('\n'));

// Generate index.html from index.org
// exec('emacs --batch --eval "(require \'org)" index.org --funcall org-html-export-to-html', (error, stdout, stderr) => {
exec('emacs --batch -l ./scripts/.emacs index.org --funcall org-html-export-to-html', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log('done.');
});
