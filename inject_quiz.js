const fs = require('fs');
const path = require('path');

const COURSES_PAGE_PATH = path.join(__dirname, 'app', '[locale]', 'courses', 'page.tsx');

let content = fs.readFileSync(COURSES_PAGE_PATH, 'utf-8');

// Add import
if (!content.includes('CourseQuiz')) {
  content = content.replace(
    'import { useTranslations } from "next-intl";',
    'import { useTranslations } from "next-intl";\nimport CourseQuiz from "@/components/game/CourseQuiz";'
  );
}

// Inject CourseQuiz 1
content = content.replace(
  /({t\('course1_tk3_text'\)}\s*<\/p>\s*<\/div>\s*<\/div>\s*)(<\/div>)/,
  '$1<CourseQuiz courseId={1} />\n          $2'
);

// Inject CourseQuiz 2
content = content.replace(
  /({t\('course2_tk5_text'\)}\s*<\/p>\s*<\/div>\s*<\/div>\s*)(<\/div>)/,
  '$1<CourseQuiz courseId={2} />\n          $2'
);

// Inject CourseQuiz 3
content = content.replace(
  /({t\('course3_tk5_text'\)}\s*<\/p>\s*<\/div>\s*<\/div>\s*)(<\/div>)/,
  '$1<CourseQuiz courseId={3} />\n          $2'
);

// Inject CourseQuiz 4
content = content.replace(
  /({t\('course4_tk3_text'\)}\s*<\/p>\s*<\/div>\s*<\/div>\s*)(<\/div>)/,
  '$1<CourseQuiz courseId={4} />\n          $2'
);

fs.writeFileSync(COURSES_PAGE_PATH, content);
