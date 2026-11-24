import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { ACTION_CALENDAR, CLUBS, HubMedia, PODCASTS, PRO_VIDEOS } from '../data/hub';
import { colors, fonts, shadow } from '../theme';

const fmt = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function Soon({ what }: { what: string }) {
  return <T v="small">The Swachh Kal team is adding {what}. Check back soon!</T>;
}

function Link({ emoji, title, sub, url }: { emoji: string; title: string; sub?: string; url?: string }) {
  return (
    <Bouncy onPress={() => url && WebBrowser.openBrowserAsync(url)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <T style={{ fontFamily: fonts.bodyBold }}>{title}</T>
        {sub ? <T v="small">{sub}</T> : null}
      </View>
      {url ? <Text style={{ fontSize: 18, color: colors.brand }}>↗</Text> : null}
    </Bouncy>
  );
}

const media = (list: HubMedia[], emoji: string) => list.map((m) => <Link key={m.url} emoji={emoji} title={m.title} sub={m.by} url={m.url} />);

export default function Hub() {
  const today = new Date().toISOString().slice(0, 10);
  const events = [...ACTION_CALENDAR].filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Screen gradient={['#FFF4D6', '#E3F9D9']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 14 }} showsVerticalScrollIndicator={false}>
          <Bouncy onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <T v="title">Action Hub 🏛️</T>
          <T v="h3">Turn what you learn into real change in your neighbourhood.</T>

          <Card>
            <T v="h2">📍 Request a resource</T>
            <T style={{ marginTop: 4 }}>Need a blue bin, a dustbin or a tap fixed near you? Tell the Swachh Kal team. Ask a grown-up before you send.</T>
            <Button label="Make a request" icon="✍️" onPress={() => router.push('/hub-request')} style={{ marginTop: 12 }} />
          </Card>

          <Card>
            <T v="h2">📅 Action calendar</T>
            <T v="small" style={{ marginBottom: 4 }}>Delhi drives you can join, like plantation drives.</T>
            {events.length ? events.map((e) => <Link key={e.date + e.title} emoji="🌱" title={e.title} sub={`${fmt(e.date)} · ${e.where}`} url={e.url} />) : <Soon what="upcoming drives" />}
          </Card>

          <Card>
            <T v="h2">🎬 Learn from the pros</T>
            <T v="small" style={{ marginBottom: 4 }}>Videos and master-class podcasts with experts.</T>
            {PRO_VIDEOS.length || PODCASTS.length ? (
              <>
                {media(PRO_VIDEOS, '🎥')}
                {media(PODCASTS, '🎙️')}
              </>
            ) : (
              <Soon what="videos and podcasts" />
            )}
          </Card>

          <Card>
            <T v="h2">🤝 Clubs and communities</T>
            <T v="small" style={{ marginBottom: 4 }}>Find people who care about the same things you do.</T>
            {CLUBS.map((c) => (
              <Link key={c.url} emoji="🌍" title={c.name} sub={c.about} url={c.url} />
            ))}
          </Card>

          <Bouncy onPress={() => router.push('/leaderboard')} style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadow }}>
            <Text style={{ fontSize: 36 }}>🏆</Text>
            <View style={{ flex: 1 }}>
              <T v="h3">School leaderboard</T>
              <T v="small">See which schools are doing the most for the planet.</T>
            </View>
          </Bouncy>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
