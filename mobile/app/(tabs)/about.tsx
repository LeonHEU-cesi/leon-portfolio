import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">À propos</ThemedText>
        <ThemedText style={styles.p}>
          Léon HEU, développeur full-stack en formation Concepteur Développeur
          d&apos;Applications au CESI.
        </ThemedText>
        <ThemedText style={styles.p}>
          Je conçois des applications web et mobiles soignées, du modèle de
          données à la mise en production self-host : Next.js, TypeScript,
          Prisma/PostgreSQL, Expo, Docker.
        </ThemedText>
        <ThemedText style={styles.p}>
          Ce portfolio mobile consomme la même API que le site leonheu.fr.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  p: { lineHeight: 22, opacity: 0.9 },
});
