/**
 * Single source of truth for public site copy.
 * Edit this file to change the text shown on the site.
 */

export const site = {
  name: 'Luis Gabrielle Putan',
  firstName: 'Luis',
  wordmark: 'lgputan',
  role: 'Computer Science student and full-stack developer',
  shortRole: 'Computer Science student & full-stack developer',
  location: 'Philippines',
  timeZone: 'Asia/Manila',
  email: 'putan.lgab@gmail.com',
  github: 'https://github.com/Dima-salang',
  githubHandle: 'Dima-salang',
  availability: 'Open to internships',
  intro:
    'I build small, useful tools for learning, reading, and focus — and I care about how they feel to use.',
  seo: {
    title: 'Luis Gabrielle Putan — Full-stack developer',
    description:
      'Computer Science student and full-stack developer from the Philippines. I build small, useful tools for learning, reading, and focus.',
  },
}

export const bio = [
  "I'm Luis, a computer science student and full-stack developer from the Philippines. I like small tools that solve one problem well: study aids that make lectures easier to review, a cleaner way to keep up with manga, and a timer that stays out of the way while I work.",
  'Most of what I build starts as something I need myself, then turns into something I can share. I work across TypeScript, Python, and Go, and I am happiest when an interface is quiet, fast, and easy to understand.',
  "Right now I'm finishing my degree, getting better at backend work, and shipping projects that people actually use.",
]

export const now = [
  { label: 'Building', value: 'Excelsior Academy' },
  { label: 'Studying', value: 'Computer Science' },
  { label: 'Based in', value: 'Philippines' },
  { label: 'Status', value: 'Open to internships' },
]

export const principles = [
  'Make it useful before making it clever.',
  'Finish small things instead of starting big ones.',
  'Keep the interface quiet and the code easy to read.',
]

/**
 * Skills are grouped for display. Names are matched case-insensitively
 * against the database, so "Typescript" in the database still lands in
 * the Languages group. Anything unknown falls into "Other".
 */
export const skillGroups = [
  { name: 'Languages', items: ['Python', 'Go', 'Typescript', 'JavaScript'] },
  { name: 'Backend', items: ['FastAPI', 'Django', 'Node.js'] },
  { name: 'Frontend', items: ['NextJS', 'React', 'Tailwind CSS'] },
  { name: 'Data', items: ['PostgreSQL', 'SQLite'] },
  { name: 'Other', items: [] },
]

export const pages = [
  { label: 'Work', to: '/projects', description: 'Projects I have built' },
  { label: 'Skills', to: '/skills', description: 'Tools I work with' },
  { label: 'Writing', to: '/blog', description: 'Notes and write-ups' },
  { label: 'About', to: '/about', description: 'A little more about me' },
] as const
