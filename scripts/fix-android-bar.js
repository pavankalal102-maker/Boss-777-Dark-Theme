const fs = require('fs');
const path = require('path');

const candidateFiles = [
  path.join('android', 'app', 'src', 'main', 'res', 'values', 'styles.xml'),
  path.join('android', 'app', 'src', 'main', 'res', 'values-night', 'styles.xml'),
  path.join('android', 'app', 'src', 'main', 'res', 'values', 'themes.xml'),
  path.join('android', 'app', 'src', 'main', 'res', 'values-night', 'themes.xml')
];

for (const filePath of candidateFiles) {
  if (!fs.existsSync(filePath)) continue;

  let xml = fs.readFileSync(filePath, 'utf8');

  xml = xml.replace(/<item name="android:statusBarColor">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="statusBarColor">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="android:windowLightStatusBar">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="windowLightStatusBar">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="android:navigationBarColor">.*?<\/item>/g, '');
  xml = xml.replace(/<item name="android:windowLightNavigationBar">.*?<\/item>/g, '');

  const items = [
    '    <item name="android:statusBarColor">#0b0e17</item>',
    '    <item name="statusBarColor">#0b0e17</item>',
    '    <item name="android:windowLightStatusBar">false</item>',
    '    <item name="windowLightStatusBar">false</item>',
    '    <item name="android:navigationBarColor">#0b0e17</item>',
    '    <item name="android:windowLightNavigationBar">false</item>'
  ].join('\n');

  xml = xml.replace(/<\/style>/g, `${items}\n  </style>`);
  fs.writeFileSync(filePath, xml, 'utf8');
}
