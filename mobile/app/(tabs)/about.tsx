import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Écran À propos — contenu enrichi au #5.7.
export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">À propos</ThemedText>
      <ThemedText>Bio à venir.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8, justifyContent: 'center' },
});
