# Play Store Yayın Rehberi

Bu uygulama **EAS Build (Expo bulut)** ile derlenip Google Play'e yüklenecek şekilde
yapılandırıldı. Android Studio gerekmez.

- **Paket adı (applicationId):** `com.kerembasbug.dumbbellworkout` *(kalıcı — değiştirilemez)*
- **Sürüm:** `version` 1.0.0 · `versionCode` 1 → `app.json`
- **Çıktı:** Play için **AAB** (production profili), test için **APK** (preview profili)

---

## 0. Ön gereksinimler (tek seferlik)

1. **Expo hesabı** — ücretsiz: https://expo.dev/signup
2. **Google Play Developer hesabı** — tek seferlik **25 USD**: https://play.google.com/console/signup
3. **EAS CLI** kurulumu:
   ```bash
   npm install --global eas-cli
   eas login
   ```

---

## 1. Projeyi EAS'e bağla

Proje kökünde:
```bash
eas init
```
Bu, `app.json`'a bir `extra.eas.projectId` ekler (Expo hesabınla ilişkilendirir).

> `eas.json` zaten hazır (`development` / `preview` / `production` profilleri + `submit`).

---

## 2. Test derlemesi (önerilir, önce bunu dene)

Telefonunda hızlıca denemek için yüklenebilir bir **APK** üret:
```bash
eas build --platform android --profile preview
```
İlk derlemede EAS, **imzalama anahtarını (keystore)** senin için oluşturmayı önerir →
**Yes** de (EAS güvenle saklar; kaybolmaz). Derleme bitince çıkan linkten APK'yı indir,
telefona kurup tüm akışı dene.

---

## 3. Yayın derlemesi (AAB)

Play'e yüklenecek **AAB** üret:
```bash
eas build --platform android --profile production
```
Çıkan `.aab` dosyasını indir.

> Her yeni yayında `app.json` içindeki **`android.versionCode`** değerini bir artır
> (1 → 2 → 3 ...). `version` (1.0.0) ise kullanıcıya görünen sürümdür, anlamlı şekilde artır.

---

## 4. Play Console'da uygulama oluştur

https://play.google.com/console → **Uygulama oluştur**:
- Uygulama adı: **Dumbbell Antrenman**
- Dil, "Uygulama mı oyun mu" → Uygulama, Ücretsiz/Ücretli → Ücretsiz

Sonra sol menüden şu adımları doldur:

### a) Store listesi (Mağaza girişi)
- **Kısa açıklama** (80 karakter): örn. *"Evde dumbbell ile kişiye özel antrenman ve takip."*
- **Tam açıklama:** uygulamanın ne yaptığı (bölge seçimi, öneri, set/tekrar takibi).
- **Uygulama ikonu (512×512 PNG):** `assets/images/icon.png` dosyasını 512×512'ye
  ölçekleyip yükle (üretmek için: `node scripts/gen-icons.mjs` çıktısını kullan ya da iste).
- **Özellik grafiği (1024×500 PNG):** zorunlu — basit bir kapak görseli.
- **Ekran görüntüleri:** en az 2 telefon ekran görüntüsü (uygulamadan al).

### b) Gizlilik politikası
- `PRIVACY.md` içeriğini bir URL'de yayınla (örn. GitHub'da bu repoyu public yapıp
  ham dosya linki, veya GitHub Pages / Notion / kişisel site). URL'yi Play Console'a gir.

### c) Veri güvenliği (Data Safety) formu
- "Uygulama veri topluyor/paylaşıyor mu?" → **Hayır** (her şey cihazda yerel; ağ yok).
- Bu yüzden form çok kısa sürer.

### d) İçerik derecelendirmesi, hedef kitle, reklamlar
- Reklam: **Yok**. Hedef kitle: 13+ (sağlık/fitness). Anketi doldur.

---

## 5. AAB'yi yükle ve yayınla

Önerilen sıra: **Internal testing** (kapalı test) → sonra **Production**.

- **Internal testing:** Play Console → Test → Internal testing → Sürüm oluştur →
  AAB'yi yükle → test kullanıcısı e-postalarını ekle → linkle kendin dene.
- Her şey iyiyse **Production** → Yeni sürüm → aynı AAB → incelemeye gönder.
  (İlk inceleme birkaç gün sürebilir.)

### (Opsiyonel) Komut satırından otomatik yükleme
`eas submit` ile manuel yüklemeyi atlayabilirsin. Bunun için Google Cloud'da bir
**servis hesabı** oluşturup JSON anahtarını `google-play-key.json` olarak proje köküne
koy (bu dosya `.gitignore`'da). Sonra:
```bash
eas submit --platform android --profile production --latest
```
Rehber: https://docs.expo.dev/submit/android/

---

## Hızlı özet

```bash
npm install --global eas-cli
eas login
eas init
eas build --platform android --profile preview      # telefonda test (APK)
eas build --platform android --profile production    # Play için AAB
# → Play Console'da listele, AAB'yi yükle, incelemeye gönder
```

## Sürüm yükseltme (sonraki güncellemeler)
1. `app.json` → `android.versionCode` +1, gerekiyorsa `version` güncelle.
2. `eas build --platform android --profile production`
3. Yeni AAB'yi Play Console'a yükle.
