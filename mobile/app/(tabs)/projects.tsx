import { Link } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProjects } from '@/hooks/use-projects';
import { useReduceMotion } from '@/hooks/use-reduce-motion';

export default function ProjectsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useProjects();
  const reduceMotion = useReduceMotion();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
        <ThemedText>Chargement…</ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Impossible de charger les projets.</ThemedText>
      </ThemedView>
    );
  }

  const projects = data ?? [];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.h1}>
        Projets
      </ThemedText>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={<ThemedText>Aucun projet pour le moment.</ThemedText>}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={
              reduceMotion ? undefined : FadeInDown.delay(index * 50).duration(250)
            }>
            <Link href={`/projects/${item.slug}`} asChild>
              <Pressable accessibilityRole="button">
                <ThemedView style={styles.card}>
                  <ThemedText type="subtitle">{item.title}</ThemedText>
                  <ThemedText>{item.summary}</ThemedText>
                  {item.tags.length > 0 && (
                    <ThemedText style={styles.tags}>
                      {item.tags.join(' · ')}
                    </ThemedText>
                  )}
                </ThemedView>
              </Pressable>
            </Link>
          </Animated.View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  h1: { marginBottom: 16 },
  list: { gap: 12, paddingBottom: 24 },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tags: { opacity: 0.7, fontSize: 12 },
});
