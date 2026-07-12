"use client";

import TopHeader from "@/components/game/TopHeader";
import BottomNav from "@/components/game/BottomNav";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

export default function CoursesPage() {
  return (
    <div className="fixed inset-0 bg-app-global flex flex-col overflow-hidden text-gray-900 overscroll-none">
      <TopHeader />

      <main className="flex-1 overflow-y-auto overscroll-none pb-32 scrollbar-hide px-4 pt-24">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#2d5a27] mb-2 tracking-tight">Grid Academy</h1>
            <p className="text-sm text-gray-700 font-medium">Master the fundamentals of energy.</p>
          </div>

          {/* Course 1: FirstEnergy Journey */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">The Journey of Electricity</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/rzsejNlvA8Y"
                thumbnailSrc="https://img.youtube.com/vi/rzsejNlvA8Y/maxresdefault.jpg"
                thumbnailAlt="Journey of Electricity"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Takeaways</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-cyan-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Generation (0:16-0:24):</span> Electricity is created at power generating facilities using various fuel sources, including coal, nuclear energy, natural gas, and renewable resources like wind and solar.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-amber-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Transmission (0:25-0:37):</span> Once generated, electricity moves across a network of high-voltage transmission lines, which act as the backbone of the electric grid to transport power over long distances.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-purple-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Distribution (0:38-0:59):</span> Electricity arrives at a neighborhood substation, where the voltage is lowered to a safe, usable level. From there, it travels along the poles and wires in your community directly to your home's power outlet.
                </p>
              </div>
            </div>
          </div>

          {/* Course 2: Solar PV Explainer */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How Home Solar Energy Systems Operate</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/ZzCjZb8mFwM"
                thumbnailSrc="https://img.youtube.com/vi/ZzCjZb8mFwM/maxresdefault.jpg"
                thumbnailAlt="Solar PV Explainer Video"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Takeaways</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-amber-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">How Solar PV Works:</span> Solar panels, or solar PV, use semiconducting material to absorb sunlight and convert it into electricity (0:00-0:11).
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-green-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Conversion & Usage:</span> The electricity produced is direct current (DC), which must be converted to alternating current (AC) via an inverter to be safe and usable for home appliances (0:17-0:30).
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-blue-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Monitoring:</span> A meter installed in your home allows you to track real-time electricity generation (0:33-0:37).
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-orange-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Limitations & Grid Dependency:</span> Generation is weather-dependent; panels produce less on dull days and do not work at night. Because of this, homeowners typically remain connected to the National Grid.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-purple-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Storage & Export:</span> While a solar battery can store excess energy, it usually isn't enough to make a home entirely self-sufficient. Any unused or unstored electricity is exported back to the grid.
                </p>
              </div>
            </div>
          </div>

          {/* Course 3: Hydro-Québec Substation */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tour of an Electrical Substation</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/gSPsmEwAfao"
                thumbnailSrc="https://img.youtube.com/vi/gSPsmEwAfao/maxresdefault.jpg"
                thumbnailAlt="Electrical Substation Tour"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Functions</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-blue-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Voltage Adjustment:</span> The primary role is to raise or lower voltage levels. Electricity traveling at 735,000 volts must be stepped down to 120 or 240 volts for safe household use (0:57 - 1:12).
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-cyan-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Grid Protection & Direction:</span> Substations direct electricity along the power grid and protect equipment through automated systems (0:43 - 0:48).
                </p>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-6 mb-3">Key Equipment</h3>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-orange-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Power Transformers:</span> The "heart" of the substation, responsible for changing the voltage (2:34 - 2:43).
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-red-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Breakers & Disconnect Switches:</span> These act as safety mechanisms that can cut power automatically during a fault or manually for maintenance (1:50 - 2:31).
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-amber-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Surge Arresters & Grounding:</span> Critical safety devices that protect against over-voltage, such as lightning strikes, by directing excess electricity into the ground (2:50 - 3:12).
                </p>
              </div>
            </div>
          </div>

          {/* Course 4: How Solar Cells Work */}
          <div className="glass-panel-light rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Can 100% of the World Run on Solar?</h2>
            
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-6">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/xKxrkht7CpY"
                thumbnailSrc="https://img.youtube.com/vi/xKxrkht7CpY/maxresdefault.jpg"
                thumbnailAlt="Total Solar Reliance"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Takeaways</h3>
              
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-yellow-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">How Solar Cells Work (0:33 - 2:37):</span> When photons strike silicon, they dislodge electrons, creating an electric current due to the electric field created at the PN junction between N-type and P-type silicon layers.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-red-400 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Challenges (2:37 - 3:44):</span> Solar energy is inconsistent based on geography and weather. Moving electricity and developing efficient storage are major logistical challenges. Most commercial systems are only 15–20% efficient.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-green-500 shadow-sm flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">Future Outlook (3:44 - 4:45):</span> Powering the world with solar technology is physically possible. Costs are decreasing, and innovations like floating solar farms are emerging. It already provides a safer alternative to kerosene in off-grid regions.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
