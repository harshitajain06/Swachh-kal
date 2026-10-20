import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight, SlideOutLeft, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bouncy, Button, Screen, T } from '../components/UI';
import { GENDERS, HeroId, ROLES } from '../data/content';
import { useGame } from '../lib/game';
import { colors, fonts, radius } from '../theme';

const STEPS: { hero: HeroId; say: string }[] = [
  { hero: 'vayu', say: 'Hi! I’m Vayu! What should I call you?' },
  { hero: 'tarun', say: 'Where in the world are you?' },
  { hero: 'dharti', say: 'Tell me about you! I am a…' },
  { hero: 'jal', say: 'Last one! Who are you?' },
];
const CITIES = ['Delhi', 'Gurugram', 'Noida', 'Ghaziabad', 'Faridabad'];

export default function Onboarding() {
  const { saveProfile } = useGame();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.firstName ?? '');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');

  const valid = [name.trim().length > 0, country.trim() && city.trim(), !!role, !!gender][step];
  const next = async () => {
    if (step < 3) return setStep(step + 1);
    await saveProfile({ name: name.trim(), age: age ? parseInt(age, 10) : undefined, country: country.trim(), city: city.trim(), role, gender });
    router.replace('/about');
  };

  const input = { backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: 18, paddingVertical: 14, fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink, borderWidth: 3, borderColor: colors.line } as const;
  const chip = (active: boolean) => ({ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 99, backgroundColor: active ? colors.brand : '#fff', borderWidth: 3, borderColor: active ? colors.brandDark : colors.line });

  const Option = ({ id, label, emoji, current, set }: { id: string; label: string; emoji: string; current: string; set: (v: string) => void }) => (
    <Bouncy onPress={() => set(id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: current === id ? '#EFE7FF' : '#fff', borderRadius: radius.md, padding: 14, borderWidth: 3, borderColor: current === id ? colors.brand : colors.line }}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <T v="label" style={{ flex: 1, fontSize: 16 }}>{label}</T>
      {current === id ? <Animated.Text entering={ZoomIn.springify()} style={{ fontSize: 22 }}>✅</Animated.Text> : null}
    </Bouncy>
  );

  return (
    <Screen gradient={['#FFF4D6', '#DDF5FF']}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingTop: 12 }}>
            {STEPS.map((_, i) => (
              <View key={i} style={{ flex: 1, height: 10, borderRadius: 10, backgroundColor: i <= step ? colors.brand : '#00000014' }} />
            ))}
          </View>
          <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Animated.View key={'c' + step} entering={ZoomIn.springify().damping(6)}>
                <Character id={STEPS[step].hero} size={104} />
              </Animated.View>
              <Animated.View key={'s' + step} entering={FadeInDown.delay(150)} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 24, borderBottomLeftRadius: 4, padding: 14 }}>
                <T v="h3" style={{ fontSize: 18, lineHeight: 24 }}>{STEPS[step].say}</T>
              </Animated.View>
            </View>

            <Animated.View key={step} entering={SlideInRight.springify().damping(15)} exiting={SlideOutLeft} style={{ marginTop: 20, gap: 12 }}>
              {step === 0 && (
                <>
                  <TextInput style={input} placeholder="Your name" placeholderTextColor="#A9A2C4" value={name} onChangeText={setName} />
                  <TextInput style={input} placeholder="Your age" placeholderTextColor="#A9A2C4" keyboardType="number-pad" maxLength={3} value={age} onChangeText={setAge} />
                </>
              )}
              {step === 1 && (
                <>
                  <TextInput style={input} placeholder="Country" placeholderTextColor="#A9A2C4" value={country} onChangeText={setCountry} />
                  <TextInput style={input} placeholder="City" placeholderTextColor="#A9A2C4" value={city} onChangeText={setCity} />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {CITIES.map((c) => (
                      <Bouncy key={c} onPress={() => { setCity(c); setCountry('India'); }} style={chip(city === c)}>
                        <Text style={{ fontFamily: fonts.bodyBold, color: city === c ? '#fff' : colors.ink }}>{c}</Text>
                      </Bouncy>
                    ))}
                  </View>
                </>
              )}
              {step === 2 && ROLES.map((r) => <Option key={r.id} {...r} current={role} set={setRole} />)}
              {step === 3 && GENDERS.map((g) => <Option key={g.id} {...g} current={gender} set={setGender} />)}
            </Animated.View>
          </ScrollView>
          <View style={{ position: 'absolute', left: 24, right: 24, bottom: 28, flexDirection: 'row', gap: 12 }}>
            {step > 0 && <Button label="Back" onPress={() => setStep(step - 1)} color="#fff" dark="#E0D6B8" style={{ width: 110 }} />}
            <Button label={step === 3 ? 'All done!' : 'Next'} onPress={next} disabled={!valid} style={{ flex: 1 }} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}
