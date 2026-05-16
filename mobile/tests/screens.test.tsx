import { render, screen } from '@testing-library/react-native';

import AboutScreen from '@/app/(tabs)/about';
import ContactScreen from '@/app/(tabs)/contact';

// Proxies automatisés (TM) : smoke render des écrans statiques.
describe('Écrans statiques', () => {
  it('About affiche la bio', () => {
    render(<AboutScreen />);
    expect(screen.getByText('À propos')).toBeTruthy();
    expect(screen.getByText(/développeur full-stack/i)).toBeTruthy();
  });

  it('Contact affiche les actions', () => {
    render(<ContactScreen />);
    expect(screen.getByText('Contact')).toBeTruthy();
    expect(screen.getByText('Envoyer un email')).toBeTruthy();
    expect(screen.getByText('GitHub')).toBeTruthy();
  });
});
