// The .splinecode format is a binary pack — try zlib decompress or scan for readable strings
const fs = require('fs');
const zlib = require('zlib');

const raw = fs.readFileSync('scene.splinecode');

// Try inflate (deflate without zlib header — common for Spline packs)
try {
  const inflated = zlib.inflateRawSync(raw);
  const str = inflated.toString('utf8');
  console.log('\n=== DECOMPRESSED SPLINE SCENE AUDIT ===\n');
  const names = ['Child', 'Table_Lamp', 'Floor_Lamp', 'Spot Light', 'spotLight', 'pointLight'];
  names.forEach(name => {
    const found = str.includes(name);
    console.log(`${found ? '✅ FOUND  ' : '❌ MISSING'} : "${name}"`);
  });
  // Also dump first 500 chars of JSON-like content
  const jsonStart = str.indexOf('{');
  if (jsonStart !== -1) {
    console.log('\n--- First 1000 chars of decompressed content ---');
    console.log(str.slice(jsonStart, jsonStart + 1000));
  }
} catch (e1) {
  // Try regular inflate (with zlib header)
  try {
    const inflated = zlib.inflateSync(raw);
    const str = inflated.toString('utf8');
    console.log('\n=== ZLIB INFLATED AUDIT ===\n');
    const names = ['Child', 'Table_Lamp', 'Floor_Lamp', 'Spot Light'];
    names.forEach(name => console.log(`${str.includes(name) ? '✅' : '❌'}: "${name}"`));
  } catch (e2) {
    // Try scanning raw binary for UTF8 strings
    const str = raw.toString('utf8');
    console.log('\n=== RAW UTF8 SCAN ===\n');
    const names = ['Child', 'Table_Lamp', 'Floor_Lamp', 'Spot Light', 'spotLight', 'pointLight'];
    names.forEach(name => {
      const found = str.includes(name);
      console.log(`${found ? '✅ FOUND  ' : '❌ MISSING'} : "${name}"`);
    });
    // Find any object names
    const matches = str.match(/"name"\s*:\s*"([^"]+)"/g) || [];
    if (matches.length) {
      console.log('\nAll "name" fields found:', matches.slice(0, 30).join(', '));
    }
  }
}
