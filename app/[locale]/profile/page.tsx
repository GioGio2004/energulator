import TopHeader from "@/components/game/TopHeader";
import BottomNav from "@/components/game/BottomNav";
import ProfileContent from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="fixed inset-0 bg-app-global flex flex-col overflow-hidden text-gray-900 overscroll-none">
      <TopHeader />

      <main className="flex-1 overflow-y-auto overscroll-none pb-32 scrollbar-hide px-4 pt-24">
        <div className="max-w-md mx-auto">
          <ProfileContent />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
