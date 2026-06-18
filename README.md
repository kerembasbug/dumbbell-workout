# Dumbbell Antrenman

Evde dumbbell ile antrenman yapanlar için **mobil + web** çalışan, minimal ve pratik bir
antrenman asistanı. Vücut bölgesi seçilir, o bölgeye yönelik dumbbell egzersizlerinin yapılışı
gösterilir; profile göre ağırlık ve set/tekrar önerilir; antrenman set/tekrar takibiyle kaydedilir.

> Öneriler rehber niteliğindedir, tıbbi tavsiye değildir.

## Teknoloji

- **Expo (SDK 56) + React Native + TypeScript** — tek kod tabanı, iOS/Android/web.
- **Expo Router** — dosya tabanlı navigasyon (`src/app`).
- **zustand** — global durum (profil, aktif antrenman, geçmiş).
- **AsyncStorage** — yerel kalıcılık (web'de localStorage). Tüm erişim `src/storage` arkasında soyutlanmıştır; ileride buluta (ör. Supabase) geçişte yalnızca o katman değişir.
- **react-native-svg** — tıklanabilir vücut haritası.

## Çalıştırma

```bash
npm install
npm run web        # tarayıcıda
npm run ios        # iOS simülatör / Expo Go
npm run android    # Android emülatör / Expo Go
npm test           # öneri motoru birim testleri (jest)
```

## Yapı

```
src/
  app/                 # Expo Router ekranları
    index.tsx          # Ana ekran: vücut haritası + bölge seçimi
    onboarding.tsx     # Hedef + profil (ilk açılış)
    region/[region]    # Bölgenin egzersiz listesi
    exercise/[id]      # Egzersiz detayı + kişiye özel öneri + tersine hesap
    workout.tsx        # Aktif antrenman takibi (set/tekrar, dinlenme zamanlayıcısı)
    history.tsx        # Geçmiş antrenmanlar + özet
    settings.tsx       # Profil & ayarlar
  data/                # bodyRegions, exercises (statik veri tabanı)
  domain/              # types, recommend (öneri motoru) + testler
  store/               # zustand store'ları (profile, session, history)
  storage/             # kalıcılık soyutlaması
  components/          # Screen, Button, Card, Stepper, BodyMap, RestTimer ...
  constants/theme.ts   # tasarım sistemi (renk/spacing/radius/tipografi)
```

## Öneri Motoru (`src/domain/recommend.ts`)

İki yönlü çalışır:
- **Profil → ağırlık:** kilo × egzersiz yük faktörü × deneyim × cinsiyet × hedef katsayıları;
  sonuç sahip olunan dumbbell'a yuvarlanır.
- **Eldeki ağırlık → set/tekrar:** seçilen dumbbell ideal ağırlıkla karşılaştırılır; hafif/ağır
  durumda tekrarları ayarlar ve uyarı verir.
