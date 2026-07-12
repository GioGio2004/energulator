"use client";

import TopHeader from "@/components/game/TopHeader";
import BottomNav from "@/components/game/BottomNav";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useTranslations } from "next-intl";
import CourseQuiz from "@/components/game/CourseQuiz";

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
          <CourseQuiz courseId={1} />
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
          <CourseQuiz courseId={2} />
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
          <CourseQuiz courseId={3} />
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
          <CourseQuiz courseId={4} />
          </div>
          
        </div>
      </main>

      <BottomNav />
    </div>
  );
}