import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Button, ScrollView, Share, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProject } from '@/hooks/use-projects';
import { buildShareMessage } from '@/lib/share';

export default function ProjectDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (isError || !data) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Projet introuvable.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: data.title }} />
      <ThemedText type="title">{data.title}</ThemedText>
      <ThemedText style={styles.summary}>{data.summary}</ThemedText>
      {data.tags.length > 0 && (
        <ThemedText style={styles.tags}>{data.tags.join(' · ')}</ThemedText>
      )}
      <ThemedText style={styles.body}>{data.content ?? data.summary}</ThemedText>
      <Button
        title="Partager"
        onPress={() => Share.share({ message: buildShareMessage(data) })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summary: { fontSize: 16, opacity: 0.85 },
  tags: { fontSize: 12, opacity: 0.6 },
  body: { marginVertical: 8, lineHeight: 22 },
});
