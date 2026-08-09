import HeroEditorial from './components/hero/HeroEditorial'
import About from './components/sections/About'
import ExperienceTimeline from './components/sections/ExperienceTimeline'
import SelectedWork from './components/sections/SelectedWork'
import SkillsGrid from './components/sections/SkillsGrid'
import Contact from './components/sections/Contact'

export default function Home() {
  return (
    <main className="relative">
      <HeroEditorial />
      <About />
      <ExperienceTimeline />
      <SelectedWork />
      <SkillsGrid />
      <Contact />
    </main>
  )
}
