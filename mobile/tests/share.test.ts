import { buildShareMessage } from '@/lib/share';

describe('buildShareMessage', () => {
  it('inclut titre, résumé et lien web du projet', () => {
    const msg = buildShareMessage({
      slug: 'leon-portfolio',
      title: 'leon-portfolio',
      summary: 'Portfolio perso',
      tags: [],
      imageGradient: 'g',
    });
    expect(msg).toContain('leon-portfolio');
    expect(msg).toContain('Portfolio perso');
    expect(msg).toMatch(/\/projets\/leon-portfolio$/);
  });
});
