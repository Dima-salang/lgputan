/**
 * Single source of truth for public site copy.
 */

export const site = {
  name: 'Luis Gabrielle Putan',
  firstName: 'Luis',
  displayFirst: 'Luis Gabrielle',
  displayLast: 'Putan',
  wordmark: 'lgputan',
  role: 'Computer Science student and full-stack engineer',
  shortRole: 'Computer Science student & full-stack engineer',
  location: 'Philippines',
  timeZone: 'Asia/Manila',
  email: 'putan.lgab@gmail.com',
  github: 'https://github.com/Dima-salang',
  githubHandle: 'Dima-salang',
  availability: 'Open to work',
  intro:
    'I build small, useful tools for learning, reading, and focus — and I care about how they feel to use.',
  seo: {
    title: 'Luis Gabrielle Putan — Full-stack engineer',
    description:
      'Computer Science student and full-stack engineer from the Philippines. I build small, useful tools for learning, reading, and focus.',
  },
}

export const bio = [
  "I'm Luis, a computer science student and full-stack engineer from the Philippines. I like small tools that solve one problem well: study aids that make lectures easier to review, a cleaner way to keep up with manga, and a timer that stays out of the way while I work.",
  'Most of what I build starts as something I need myself, then turns into something I can share. I work across TypeScript, Python, and Go, and I am happiest when an interface is quiet, fast, and easy to understand.',
  "Right now I'm finishing my degree, getting better at backend work, and shipping projects that people actually use.",
]

export const now = [
  { label: 'Building', value: 'Excelsior Academy' },
  { label: 'Studying', value: 'Computer Science' },
  { label: 'Based in', value: 'Philippines' },
  { label: 'Status', value: site.availability },
]

export const principles = [
  'Pragmatism and simplicity first.',
  'Finish small things instead of starting big ones.',
  'Err, and err, and err, but less, and less, and less.',
]

export const pages = [
  { label: 'Work', to: '/projects', description: 'Projects I have built' },
  { label: 'Skills', to: '/skills', description: 'Tools I work with' },
  { label: 'Writing', to: '/blog', description: 'Notes and write-ups' },
  { label: 'About', to: '/about', description: 'A little more about me' },
] as const
