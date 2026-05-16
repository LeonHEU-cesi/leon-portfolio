import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Léon HEU</ThemedText>
      <ThemedText type="subtitle">Développeur full-stack</ThemedText>
      <ThemedText style={styles.pitch}>
        Portfolio mobile : explorez mes projets web, mobile et infrastructure.
      </ThemedText>
      <Link href="/projects" style={styles.cta}>
        <ThemedText type="link">Voir les projets →</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  pitch: { marginTop: 8 },
  cta: { marginTop: 16 },
});
