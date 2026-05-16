// Lighthouse CI — collecte sur le build prod (npm run start) + budgets.
// a11y/best-practices/seo en assertion stricte, performance en warn
// (runner CI variable). Le gate a11y dur est l'audit axe (#6.8).
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready in',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/projets',
        'http://localhost:3000/cv',
        'http://localhost:3000/about',
        'http://localhost:3000/contact',
      ],
      numberOfRuns: 1,
      settings: { preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
