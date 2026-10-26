export const PROJECTS = [
  {
    slug: 'papanclip', title: 'Papanclip', number: '001',
    summary: 'proj2.desc', problem: 'proj2.problem', contribution: 'proj2.contribution',
    features: ['proj2.f1', 'proj2.f2', 'proj2.f3', 'proj2.f4', 'proj2.f5', 'proj2.f6', 'proj2.f7', 'proj2.f8', 'proj2.f9', 'proj2.f10'],
    tech: ['Next.js', 'NestJS', 'PostgreSQL', 'FastAPI', 'Socket.IO'],
    techGroups: [
      { label: 'proj2.techFrontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'] },
      { label: 'proj2.techData', items: ['TanStack Query', 'TanStack Table', 'React Hook Form', 'Zod', 'Axios'] },
      { label: 'proj2.techBackend', items: ['NestJS', 'TypeScript', 'Prisma', 'PostgreSQL'] },
      { label: 'proj2.techRealtime', items: ['Socket.IO'] },
      { label: 'proj2.techAi', items: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'LLM gateway'] },
      { label: 'proj2.techDocs', items: ['PyMuPDF', 'RapidOCR', 'python-docx', 'openpyxl'] },
      { label: 'proj2.techStorage', items: ['Cloudflare R2', 'Midtrans'] },
      { label: 'proj2.techQuality', items: ['Docker', 'GitHub Actions', 'Jest', 'Pytest', 'Ruff'] },
    ],
    links: { live: 'https://papanclip.hompimpa.biz.id/', repo: '' }, // Source code is private.
    screenshots: ['assets/projects/papanclip/01.webp', 'assets/projects/papanclip/02.webp', 'assets/projects/papanclip/03.webp'],
    role: 'role.fullstack',
  },
  {
    slug: 'finance-workspace-api', title: 'Finance Workspace API', number: '002',
    summary: 'proj1.desc', features: ['proj1.f1', 'proj1.f2', 'proj1.f3', 'proj1.f4'],
    tech: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Swagger'],
    links: { live: 'https://finance-workspace-api.vercel.app/docs', repo: 'https://github.com/onicyborg/finance-workspace-api.git' }, // TODO: add verified live and repository URLs.
    screenshots: ['assets/projects/finance-workspace-api/01.webp', 'assets/projects/finance-workspace-api/02.webp', 'assets/projects/finance-workspace-api/03.webp'],
    role: 'role.backend',
  },
  {
    slug: 'easykan', title: 'EasyKan', number: '003',
    summary: 'proj3.desc', features: ['proj3.f1', 'proj3.f2', 'proj3.f3', 'proj3.f4'],
    tech: ['PHP', 'Laravel', 'PostgreSQL', 'MS Graph API'],
    links: { live: '', repo: '' }, // Company project; demo and source code are private.
    screenshots: ['assets/projects/easykan/01.webp', 'assets/projects/easykan/02.webp', 'assets/projects/easykan/03.webp'],
    role: 'role.fullstack',
  },
  {
    slug: 'K2-Net', title: 'K2-Net', number: '004',
    summary: 'proj4.desc', features: ['proj4.f1', 'proj4.f2', 'proj4.f3', 'proj4.f4'],
    tech: ['PHP', 'Laravel 12', 'MySQL', 'PostgreSQL', 'JWT', 'WhatsApp API', 'Metronic v8'],
    links: { live: 'https://k2-net.namikulo.com/', repo: 'https://github.com/onicyborg/K2-Net.git' }, // TODO: add verified live and repository URLs.
    screenshots: ['assets/projects/K2-Net/01.webp', 'assets/projects/K2-Net/02.webp', 'assets/projects/K2-Net/03.webp'],
    role: 'role.fullstack',
  },
  {
    slug: 'Antre-In', title: 'Antre-In', number: '005',
    summary: 'proj5.desc', features: ['proj5.f1', 'proj5.f2', 'proj5.f3', 'proj5.f4'],
    tech: ['PHP 8.2', 'Laravel 12', 'MySQL/MariaDB', 'Blade Templates', 'jQuery', 'Bootstrap 4', 'Otika Admin Template'],
    links: { live: 'https://antre-in.skripsian.site/', repo: 'https://github.com/onicyborg/antre-in.git' }, // TODO: add verified live and repository URLs.
    screenshots: ['assets/projects/antre-in/01.webp', 'assets/projects/antre-in/02.webp', 'assets/projects/antre-in/03.webp'],
    role: 'role.fullstack',
  },
  {
    slug: 'namikulo-course', title: 'Namikulo Course', number: '006',
    summary: 'proj6.desc', problem: 'proj6.problem', contribution: 'proj6.contribution',
    features: ['proj6.f1', 'proj6.f2', 'proj6.f3', 'proj6.f4'],
    tech: ['PHP', 'Laravel 12', 'Blade', 'Custom CSS', 'JavaScript', 'Bootstrap 4', 'PostgreSQL/MySQL', 'Midtrans Core API', 'Cloudflare R2', 'ffmpeg.wasm', 'hls.js', 'Lexical', 'Yajra DataTables', 'Dompdf'],
    previewTech: ['Laravel 12', 'Blade', 'Midtrans', 'Cloudflare R2', 'hls.js'],
    links: { live: 'https://course.namikulo.com/', repo: 'https://github.com/onicyborg/namikulo-course' },
    screenshots: ['assets/projects/namikulo-course/01.webp', 'assets/projects/namikulo-course/02.webp', 'assets/projects/namikulo-course/03.webp'],
    screenshotAlts: ['proj6.s1', 'proj6.s2', 'proj6.s3'],
    role: 'role.fullstackQa',
  },
];
