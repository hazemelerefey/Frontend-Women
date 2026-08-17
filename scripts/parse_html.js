const fs = require('fs');
const html = fs.readFileSync('C:/Users/Test/.gemini/antigravity/brain/c52f184b-bcdb-4c34-9700-66926b0c8116/scratch/site_html.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const getSection = (selector) => {
  const el = $(selector).first();
  if (el.length === 0) return 'Not found: ' + selector;
  return $.html(el);
};

fs.writeFileSync('C:/Users/Test/.gemini/antigravity/brain/c52f184b-bcdb-4c34-9700-66926b0c8116/scratch/hero_about_html.txt', 
  '--- MAIN SCREEN ---\n' + getSection('.main-screen') + 
  '\n\n--- ABOUT SECTION ---\n' + getSection('.about') +
  '\n\n--- MISSION SECTION ---\n' + getSection('.mission') +
  '\n\n--- CALC SECTION ---\n' + getSection('.calc')
);
console.log('Saved to scratch file.');
