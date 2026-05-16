import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Écran Contact — mailto / partage ajoutés au #5.8.
export default function ContactScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Contact</ThemedText>
      <ThemedText>Coordonnées à venir.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8, justifyContent: 'center' },
});
