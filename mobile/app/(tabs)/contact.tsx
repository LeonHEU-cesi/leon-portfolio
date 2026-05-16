import { Button, Linking, Share, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { buildMailtoUrl, CONTACT_EMAIL, GITHUB_URL } from '@/lib/contact';

export default function ContactScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Contact</ThemedText>
      <ThemedText style={styles.p}>
        Disponible pour échanger autour d&apos;un projet ou d&apos;une
        alternance.
      </ThemedText>
      <Button
        title="Envoyer un email"
        onPress={() =>
          Linking.openURL(buildMailtoUrl(CONTACT_EMAIL, 'Contact via le portfolio'))
        }
      />
      <Button title="GitHub" onPress={() => Linking.openURL(GITHUB_URL)} />
      <Button
        title="Partager mon profil"
        onPress={() =>
          Share.share({ message: `Portfolio de Léon HEU — ${GITHUB_URL}` })
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 14, justifyContent: 'center' },
  p: { lineHeight: 22, opacity: 0.9, marginBottom: 8 },
});
