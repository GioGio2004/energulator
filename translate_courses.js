const fs = require('fs');
const path = require('path');

const EN_JSON_PATH = path.join(__dirname, 'messages', 'en.json');
const KA_JSON_PATH = path.join(__dirname, 'messages', 'ka.json');
const COURSES_PAGE_PATH = path.join(__dirname, 'app', '[locale]', 'courses', 'page.tsx');

const coursesDataEN = {
  course1_title: "The Journey of Electricity",
  course1_tk1_bold: "Generation (0:16-0:24):",
  course1_tk1_text: "Electricity is created at power generating facilities using various fuel sources, including coal, nuclear energy, natural gas, and renewable resources like wind and solar.",
  course1_tk2_bold: "Transmission (0:25-0:37):",
  course1_tk2_text: "Once generated, electricity moves across a network of high-voltage transmission lines, which act as the backbone of the electric grid to transport power over long distances.",
  course1_tk3_bold: "Distribution (0:38-0:59):",
  course1_tk3_text: "Electricity arrives at a neighborhood substation, where the voltage is lowered to a safe, usable level. From there, it travels along the poles and wires in your community directly to your home's power outlet.",

  course2_title: "How Home Solar Energy Systems Operate",
  course2_tk1_bold: "How Solar PV Works:",
  course2_tk1_text: "Solar panels, or solar PV, use semiconducting material to absorb sunlight and convert it into electricity (0:00-0:11).",
  course2_tk2_bold: "Conversion & Usage:",
  course2_tk2_text: "The electricity produced is direct current (DC), which must be converted to alternating current (AC) via an inverter to be safe and usable for home appliances (0:17-0:30).",
  course2_tk3_bold: "Monitoring:",
  course2_tk3_text: "A meter installed in your home allows you to track real-time electricity generation (0:33-0:37).",
  course2_tk4_bold: "Limitations & Grid Dependency:",
  course2_tk4_text: "Generation is weather-dependent; panels produce less on dull days and do not work at night. Because of this, homeowners typically remain connected to the National Grid.",
  course2_tk5_bold: "Storage & Export:",
  course2_tk5_text: "While a solar battery can store excess energy, it usually isn't enough to make a home entirely self-sufficient. Any unused or unstored electricity is exported back to the grid.",

  course3_title: "Tour of an Electrical Substation",
  course3_keyFunctions: "Key Functions",
  course3_tk1_bold: "Voltage Adjustment:",
  course3_tk1_text: "The primary role is to raise or lower voltage levels. Electricity traveling at 735,000 volts must be stepped down to 120 or 240 volts for safe household use (0:57 - 1:12).",
  course3_tk2_bold: "Grid Protection & Direction:",
  course3_tk2_text: "Substations direct electricity along the power grid and protect equipment through automated systems (0:43 - 0:48).",
  course3_keyEquipment: "Key Equipment",
  course3_tk3_bold: "Power Transformers:",
  course3_tk3_text: "The \"heart\" of the substation, responsible for changing the voltage (2:34 - 2:43).",
  course3_tk4_bold: "Breakers & Disconnect Switches:",
  course3_tk4_text: "These act as safety mechanisms that can cut power automatically during a fault or manually for maintenance (1:50 - 2:31).",
  course3_tk5_bold: "Surge Arresters & Grounding:",
  course3_tk5_text: "Critical safety devices that protect against over-voltage, such as lightning strikes, by directing excess electricity into the ground (2:50 - 3:12).",

  course4_title: "Can 100% of the World Run on Solar?",
  course4_tk1_bold: "How Solar Cells Work (0:33 - 2:37):",
  course4_tk1_text: "When photons strike silicon, they dislodge electrons, creating an electric current due to the electric field created at the PN junction between N-type and P-type silicon layers.",
  course4_tk2_bold: "Challenges (2:37 - 3:44):",
  course4_tk2_text: "Solar energy is inconsistent based on geography and weather. Moving electricity and developing efficient storage are major logistical challenges. Most commercial systems are only 15–20% efficient.",
  course4_tk3_bold: "Future Outlook (3:44 - 4:45):",
  course4_tk3_text: "Powering the world with solar technology is physically possible. Costs are decreasing, and innovations like floating solar farms are emerging. It already provides a safer alternative to kerosene in off-grid regions."
};

const coursesDataKA = {
  course1_title: "ელექტროენერგიის მოგზაურობა",
  course1_tk1_bold: "გენერაცია (0:16-0:24):",
  course1_tk1_text: "ელექტროენერგია იქმნება ელექტროსადგურებში სხვადასხვა საწვავის გამოყენებით, მათ შორის ქვანახშირის, ბირთვული ენერგიის, ბუნებრივი აირის და განახლებადი რესურსების, როგორიცაა ქარი და მზე.",
  course1_tk2_bold: "გადაცემა (0:25-0:37):",
  course1_tk2_text: "გენერირების შემდეგ, ელექტროენერგია გადაადგილდება მაღალი ძაბვის გადამცემი ხაზების ქსელში, რომლებიც წარმოადგენს ელექტროქსელის ხერხემალს.",
  course1_tk3_bold: "განაწილება (0:38-0:59):",
  course1_tk3_text: "ელექტროენერგია მიდის უბნის ქვესადგურში, სადაც ძაბვა მცირდება უსაფრთხო დონემდე. იქიდან იგი მიემართება ბოძებისა და სადენების გავლით თქვენი სახლისკენ.",

  course2_title: "როგორ მუშაობს სახლის მზის ენერგიის სისტემები",
  course2_tk1_bold: "როგორ მუშაობს მზის პანელები:",
  course2_tk1_text: "მზის პანელები, ან მზის PV, იყენებენ ნახევარგამტარულ მასალას მზის შუქის შთანთქმისთვის და მის ელექტროენერგიად გარდაქმნისთვის (0:00-0:11).",
  course2_tk2_bold: "გარდაქმნა და გამოყენება:",
  course2_tk2_text: "წარმოებული ელექტროენერგია არის მუდმივი დენი (DC), რომელიც ინვერტორის საშუალებით უნდა გარდაიქმნას ცვლად დენად (AC), რომ უსაფრთხო იყოს სახლის მოხმარებისთვის (0:17-0:30).",
  course2_tk3_bold: "მონიტორინგი:",
  course2_tk3_text: "თქვენს სახლში დამონტაჟებული მრიცხველი გაძლევთ საშუალებას რეალურ დროში ადევნოთ თვალი ენერგიის გენერაციას (0:33-0:37).",
  course2_tk4_bold: "შეზღუდვები და ქსელზე დამოკიდებულება:",
  course2_tk4_text: "გენერაცია დამოკიდებულია ამინდზე; პანელები ნაკლებს გამოიმუშავებენ მოღრუბლულ დღეებში და არ მუშაობენ ღამით. ამის გამო სახლები კვლავ მიერთებულია ეროვნულ ქსელზე.",
  course2_tk5_bold: "შენახვა და ექსპორტი:",
  course2_tk5_text: "მზის ბატარეას შეუძლია ზედმეტი ენერგიის შენახვა, მაგრამ ხშირად არასაკმარისია. გამოუყენებელი ენერგია უკან ბრუნდება ქსელში.",

  course3_title: "ელექტრო ქვესადგურის ტური",
  course3_keyFunctions: "მთავარი ფუნქციები",
  course3_tk1_bold: "ძაბვის რეგულირება:",
  course3_tk1_text: "მთავარი როლი ძაბვის დონის აწევა ან დაწევაა. 735,000 ვოლტზე მოძრავი ელექტროენერგია უნდა შემცირდეს 120 ან 240 ვოლტამდე (0:57 - 1:12).",
  course3_tk2_bold: "ქსელის დაცვა და მიმართულება:",
  course3_tk2_text: "ქვესადგურები მიმართავენ ელექტროენერგიას ქსელში და იცავენ აღჭურვილობას ავტომატიზებული სისტემების მეშვეობით (0:43 - 0:48).",
  course3_keyEquipment: "მთავარი აღჭურვილობა",
  course3_tk3_bold: "ძალოვანი ტრანსფორმატორები:",
  course3_tk3_text: "ქვესადგურის \"გული\", პასუხისმგებელია ძაბვის შეცვლაზე (2:34 - 2:43).",
  course3_tk4_bold: "ამომრთველები და გამთიშველები:",
  course3_tk4_text: "ესენია უსაფრთხოების მექანიზმები, რომლებსაც შეუძლიათ ელექტროენერგიის გათიშვა ავტომატურად (1:50 - 2:31).",
  course3_tk5_bold: "გადამეტძაბვისგან დამცავები და დამიწება:",
  course3_tk5_text: "კრიტიკული მოწყობილობები, რომლებიც იცავენ ზედმეტი ძაბვისგან, როგორიცაა ელვა, ჭარბი ენერგიის მიწაში გადატანით (2:50 - 3:12).",

  course4_title: "შეუძლია თუ არა მსოფლიოს 100% მზის ენერგიაზე გადასვლა?",
  course4_tk1_bold: "როგორ მუშაობს მზის უჯრედები (0:33 - 2:37):",
  course4_tk1_text: "როდესაც ფოტონები ეჯახება სილიციუმს, ისინი აძევებენ ელექტრონებს, რაც ქმნის ელექტრულ დენს.",
  course4_tk2_bold: "გამოწვევები (2:37 - 3:44):",
  course4_tk2_text: "მზის ენერგია არასტაბილურია. ენერგიის შენახვა ლოგისტიკური გამოწვევაა. კომერციული სისტემების ეფექტურობა მხოლოდ 15-20%-ია.",
  course4_tk3_bold: "მომავლის პერსპექტივა (3:44 - 4:45):",
  course4_tk3_text: "მსოფლიოს მზის ტექნოლოგიით უზრუნველყოფა ფიზიკურად შესაძლებელია. ხარჯები მცირდება და ჩნდება ინოვაციები."
};

const enJSON = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));
enJSON.courses = { ...enJSON.courses, ...coursesDataEN };
fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJSON, null, 2));

const kaJSON = JSON.parse(fs.readFileSync(KA_JSON_PATH, 'utf-8'));
kaJSON.courses = { ...kaJSON.courses, ...coursesDataKA };
fs.writeFileSync(KA_JSON_PATH, JSON.stringify(kaJSON, null, 2));

const pageCode = `"use client";

import TopHeader from "@/components/game/TopHeader";
import BottomNav from "@/components/game/BottomNav";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useTranslations } from "next-intl";

export default function CoursesPage() {
  const t = useTranslations("courses");

  return (
    <div className="fixed top-0 inset-x-0 h-[100dvh] bg-app-global flex flex-col overflow-hidden text-gray-900 overscroll-none">
      <TopHeader />

      <main className="flex-1 overflow-y-auto overscroll-none pb-32 scrollbar-hide px-4 pt-24">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#2d5a27] mb-2 tracking-tight">{t('title')}</h1>
            <p className="text-sm text-gray-700 font-medium">{t('subtitle')}</p>
          </div>

          {/* Course 1: FirstEnergy Journey */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('course1_title')}</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/rzsejNlvA8Y"
                thumbnailSrc="https://img.youtube.com/vi/rzsejNlvA8Y/maxresdefault.jpg"
                thumbnailAlt="Journey of Electricity"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{t('keyTakeaways')}</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-cyan-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course1_tk1_bold')}</span> {t('course1_tk1_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-amber-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course1_tk2_bold')}</span> {t('course1_tk2_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-purple-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course1_tk3_bold')}</span> {t('course1_tk3_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Course 2: Solar PV Explainer */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('course2_title')}</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/ZzCjZb8mFwM"
                thumbnailSrc="https://img.youtube.com/vi/ZzCjZb8mFwM/maxresdefault.jpg"
                thumbnailAlt="Solar PV Explainer Video"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{t('keyTakeaways')}</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-amber-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course2_tk1_bold')}</span> {t('course2_tk1_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-green-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course2_tk2_bold')}</span> {t('course2_tk2_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-blue-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course2_tk3_bold')}</span> {t('course2_tk3_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-orange-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course2_tk4_bold')}</span> {t('course2_tk4_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-purple-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course2_tk5_bold')}</span> {t('course2_tk5_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Course 3: Hydro-Québec Substation */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('course3_title')}</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/gSPsmEwAfao"
                thumbnailSrc="https://img.youtube.com/vi/gSPsmEwAfao/maxresdefault.jpg"
                thumbnailAlt="Electrical Substation Tour"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{t('course3_keyFunctions')}</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-blue-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course3_tk1_bold')}</span> {t('course3_tk1_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-cyan-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course3_tk2_bold')}</span> {t('course3_tk2_text')}
                </p>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-6 mb-3">{t('course3_keyEquipment')}</h3>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-orange-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course3_tk3_bold')}</span> {t('course3_tk3_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-red-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course3_tk4_bold')}</span> {t('course3_tk4_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-amber-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course3_tk5_bold')}</span> {t('course3_tk5_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Course 4: How Solar Cells Work */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('course4_title')}</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/xKxrkht7CpY"
                thumbnailSrc="https://img.youtube.com/vi/xKxrkht7CpY/maxresdefault.jpg"
                thumbnailAlt="Total Solar Reliance"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{t('keyTakeaways')}</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-yellow-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course4_tk1_bold')}</span> {t('course4_tk1_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-red-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course4_tk2_bold')}</span> {t('course4_tk2_text')}
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-green-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{t('course4_tk3_bold')}</span> {t('course4_tk3_text')}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <BottomNav />
    </div>
  );
}`;
fs.writeFileSync(COURSES_PAGE_PATH, pageCode);
