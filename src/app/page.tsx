// Poster Drive gate build mounts first; 3D engine + editorial stay parked in-tree.
import PosterJourney from './components/posters/PosterJourney'
import About from './components/sections/About'
import ExperienceTimeline from './components/sections/ExperienceTimeline'
import SelectedWork from './components/sections/SelectedWork'
import SkillsGrid from './components/sections/SkillsGrid'
import Contact from './components/sections/Contact'

export default function Home() {
  return (
    <main className="relative">
      <PosterJourney />
      <About />
      <ExperienceTimeline />
      <SelectedWork />
      <SkillsGrid />
      <Contact />
    </main>
  )
}
