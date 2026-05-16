import { buildMailtoUrl, CONTACT_EMAIL } from '@/lib/contact';

describe('buildMailtoUrl', () => {
  it('mailto simple sans sujet', () => {
    expect(buildMailtoUrl(CONTACT_EMAIL)).toBe(`mailto:${CONTACT_EMAIL}`);
  });

  it('encode le sujet', () => {
    expect(buildMailtoUrl('a@b.fr', 'Bonjour & co')).toBe(
      'mailto:a@b.fr?subject=Bonjour%20%26%20co',
    );
  });
});
