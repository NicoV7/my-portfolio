// Preview route for the 3D cinematic drive (hero3d engine) — not linked from the
// homepage. Lets the drive be reviewed in isolation while the poster atlas stays live.
import HeroDrive from '../components/hero3d/HeroDrive'

export default function DrivePreview() {
  return (
    <main className="relative">
      <HeroDrive />
    </main>
  )
}
