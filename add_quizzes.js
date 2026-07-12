const fs = require('fs');
const path = require('path');

const EN_JSON_PATH = path.join(__dirname, 'messages', 'en.json');
const KA_JSON_PATH = path.join(__dirname, 'messages', 'ka.json');

const quizzesEN = {
  ui: {
    testKnowledge: "Test Your Knowledge 🧠",
    correct: "Correct! 🎉",
    incorrect: "Oops! Try again.",
    finishQuiz: "Quiz Completed!",
    nextQuestion: "NEXT"
  },
  course1: {
    q0: "What acts as the backbone of the electric grid?",
    q0_o0: "Neighborhood substations",
    q0_o1: "High-voltage transmission lines",
    q0_o2: "Household power outlets",
    q1: "Where is voltage lowered to a safe, usable level?",
    q1_o0: "Power generating facility",
    q1_o1: "Transmission lines",
    q1_o2: "Neighborhood substation"
  },
  course2: {
    q0: "What material do solar panels use to absorb sunlight?",
    q0_o0: "Semiconducting material",
    q0_o1: "Copper wiring",
    q0_o2: "Lithium-ion",
    q1: "Why do solar homeowners typically remain connected to the National Grid?",
    q1_o0: "Because solar panels produce DC electricity",
    q1_o1: "Because generation is weather-dependent and stops at night",
    q1_o2: "Because they need a meter to monitor generation"
  },
  course3: {
    q0: "What is the primary role of a substation?",
    q0_o0: "To generate electricity",
    q0_o1: "To raise or lower voltage levels",
    q0_o2: "To store excess energy",
    q1: "What is considered the \"heart\" of the substation?",
    q1_o0: "Circuit Breakers",
    q1_o1: "Surge Arresters",
    q1_o2: "Power Transformers"
  },
  course4: {
    q0: "What happens when photons strike silicon in a solar cell?",
    q0_o0: "They dislodge electrons",
    q0_o1: "They produce heat",
    q0_o2: "They store energy",
    q1: "What is the approximate efficiency of most commercial solar systems?",
    q1_o0: "50-60%",
    q1_o1: "90-100%",
    q1_o2: "15-20%"
  }
};

const quizzesKA = {
  ui: {
    testKnowledge: "შეამოწმეთ თქვენი ცოდნა 🧠",
    correct: "სწორია! 🎉",
    incorrect: "არასწორია! სცადეთ ხელახლა.",
    finishQuiz: "ვიქტორინა დასრულებულია!",
    nextQuestion: "შემდეგი"
  },
  course1: {
    q0: "რა არის ელექტროქსელის ხერხემალი?",
    q0_o0: "უბნის ქვესადგურები",
    q0_o1: "მაღალი ძაბვის გადამცემი ხაზები",
    q0_o2: "საყოფაცხოვრებო დენის წყაროები",
    q1: "სად მცირდება ძაბვა უსაფრთხო დონემდე?",
    q1_o0: "ელექტროსადგურში",
    q1_o1: "გადამცემ ხაზებზე",
    q1_o2: "უბნის ქვესადგურში"
  },
  course2: {
    q0: "რა მასალას იყენებენ მზის პანელები სინათლის შთანთქმისთვის?",
    q0_o0: "ნახევარგამტარულ მასალას",
    q0_o1: "სპილენძის მავთულებს",
    q0_o2: "ლითიუმ-იონს",
    q1: "რატომ რჩებიან მზის ენერგიის მომხმარებლები ეროვნულ ქსელზე?",
    q1_o0: "რადგან მზის პანელები წარმოქმნიან მუდმივ დენს",
    q1_o1: "რადგან გენერაცია დამოკიდებულია ამინდზე და ჩერდება ღამით",
    q1_o2: "რადგან მათ სჭირდებათ მრიცხველი"
  },
  course3: {
    q0: "რა არის ქვესადგურის მთავარი როლი?",
    q0_o0: "ელექტროენერგიის გამომუშავება",
    q0_o1: "ძაბვის დონის აწევა ან დაწევა",
    q0_o2: "ჭარბი ენერგიის შენახვა",
    q1: "რა ითვლება ქვესადგურის \"გულად\"?",
    q1_o0: "ამომრთველები",
    q1_o1: "გადამეტძაბვისგან დამცავები",
    q1_o2: "ძალოვანი ტრანსფორმატორები"
  },
  course4: {
    q0: "რა ხდება, როდესაც ფოტონები ეჯახება სილიციუმს?",
    q0_o0: "ისინი აძევებენ ელექტრონებს",
    q0_o1: "ისინი წარმოქმნიან სითბოს",
    q0_o2: "ისინი ინახავენ ენერგიას",
    q1: "რა არის კომერციული მზის სისტემების მიახლოებითი ეფექტურობა?",
    q1_o0: "50-60%",
    q1_o1: "90-100%",
    q1_o2: "15-20%"
  }
};

const enJSON = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));
enJSON.quizzes = quizzesEN;
fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJSON, null, 2));

const kaJSON = JSON.parse(fs.readFileSync(KA_JSON_PATH, 'utf-8'));
kaJSON.quizzes = quizzesKA;
fs.writeFileSync(KA_JSON_PATH, JSON.stringify(kaJSON, null, 2));
