import andreImg from './Andre.png';
import danielImg from './Daniel.png';
import elenaImg from './Elena.png';
import bojanImg from './Bojan.png';
import zoranImg from './Zoran.png';

export const EXECUTIVE_PHOTOS = [andreImg, danielImg, elenaImg, bojanImg, zoranImg] as const;
export const EXECUTIVE_NAMES = ['Andre', 'Daniel', 'Elena', 'Bojan', 'Zoran'] as const;

// Executives that appear in the ReferRisers "life lost" rotation.
// Daniel (VP of Sales) is intentionally excluded — he shouldn't be shown shaming
// reps for missed questions on his own final exam.
const DEATH_ROTATION_PHOTOS = [andreImg, elenaImg, bojanImg, zoranImg] as const;
const DEATH_ROTATION_NAMES = ['Andre', 'Elena', 'Bojan', 'Zoran'] as const;
export const EXECUTIVE_TITLES: Record<string, string> = {
  'Andre': 'CEO',
  'Daniel': 'VP of Sales',
  'Elena': 'Head of CS',
  'Bojan': 'COO',
  'Zoran': 'CTO',
};

/** Get display name with title */
export function getExecutiveLabel(name: string): string {
  const title = EXECUTIVE_TITLES[name];
  return title ? `${name} (${title})` : name;
}

/** Get a rotating executive photo based on a death count (excludes Daniel). */
export function getDeathExecutive(deathCount: number) {
  const idx = deathCount % DEATH_ROTATION_PHOTOS.length;
  return { photo: DEATH_ROTATION_PHOTOS[idx], name: DEATH_ROTATION_NAMES[idx] };
}

export { andreImg, danielImg, elenaImg, bojanImg, zoranImg };
