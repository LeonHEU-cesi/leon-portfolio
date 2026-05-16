import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Écran Projets — le catalogue (FlatList + TanStack Query) arrive au #5.4.
export default function ProjectsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Projets</ThemedText>
      <ThemedText>Catalogue à venir.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8, justifyContent: 'center' },
});
