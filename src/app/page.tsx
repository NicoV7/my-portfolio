// 3D drive restored for the open-world build; HeroEditorial remains the
// reduced-motion/no-WebGL fallback inside HeroDrive's own gating.
import HeroDrive from './components/hero3d/HeroDrive'
import About from './components/sections/About'
import ExperienceTimeline from './components/sections/ExperienceTimeline'
import SelectedWork from './components/sections/SelectedWork'
import SkillsGrid from './components/sections/SkillsGrid'
import Contact from './components/sections/Contact'

export default function Home() {
  return (
    <main className="relative">
      <HeroDrive />
      <About />
      <ExperienceTimeline />
      <SelectedWork />
      <SkillsGrid />
      <Contact />
    </main>
  )
}
