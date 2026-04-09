// app/page.tsx
import HeroSection from '@/app/Components/Hero';
import ProgramsSection from './Components/faculty';
import MockTestSection from './Components/mocktest';
import FeaturesSection from './Components/StudentSucess';
import EntranceFaqSection from './Components/FaQ';
import UserGuide from './Components/guide';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProgramsSection />
      <MockTestSection />
      <FeaturesSection />
      <EntranceFaqSection />
      <UserGuide />
      {/* Add more sections here as needed */}
    </main>
  );
}