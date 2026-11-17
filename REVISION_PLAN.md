# Dambıl Antrenman — Revizyon Planı (Kasım 2026)

Amaç: uygulamayı grafik, kullanılabilirlik ve sunulan özellikler bakımından rakiplerin
belirgin şekilde üzerine konumlamak ve mağazada bulunur hale getirmek (ASO).

Kaynaklar: 23 rakip uygulamanın TR/ABD Play sayfaları, 11 Play araması, ~2.190 adet
1–3 yıldızlı yorum (`docs-competitors.md`), Google Ads anahtar kelime hacimleri.

---

## 1. Analiz özeti

### Pazarın durumu
- "dambıl" aramasında lider Leap "Evde Dambıl Egzersizi" (10M+). Arkasında AxiomRun (1M+),
  LifeBuddy (1M+), Nexoft (500K+). İlk 11'in dördü 50K altı kurulumda ya da 2024'ten beri güncellenmiyor:
  niş ince, girilebilir.
- Bizim mağaza sayfamız hâlâ v1 ("Dumbbell Antrenman", 5+ kurulum). v2 başlık hiç yayına girmedi;
  hiçbir hedef aramada çıkmıyoruz. **En acil iş bu.**

### Kullanıcıların rakiplerden şikâyetleri (yorum sayısı)
| Şikâyet | Adet | Bizim cevabımız |
|---|---|---|
| Ücret duvarı / fiyat | 512 | Tamamen ücretsiz, duvar yok |
| Hata / giriş sorunu | 192 | Hesap yok, internet yok |
| Sürpriz ücret | 171 | Abonelik yok |
| Reklam | 131 | Reklam yok |
| Zorla sayaç / robot tekrar sayımı | 79 | Hızı kullanıcı belirler |
| Türkçe yok | 46 | Türkçe öncelikli + İngilizce |

### Kimsenin çözmediği sorun
"Hangi ağırlıkla, kaç tekrar?" Rakipler ya sabit plan veriyor ya ağırlığı hiç sormuyor.
Kullanıcılar "kg dambıl başına mı toplam mı", "ağırlığımı kaydedemiyorum" diye yakınıyor.
**Bizim konumumuz: "Elindeki dambıla göre program — ağırlığı ne zaman artıracağını söyler."**

---

## 2. Konumlanma

| | Leap / Nexoft / LifeBuddy | Hevy / Strong | Dambıl Antrenman |
|---|---|---|---|
| Hazır program | 30 günlük, sabit | Şablon | 5 program, ağırlıkları kişiye göre dolu |
| Ağırlık önerisi | Yok | Yok | Elindeki dambıllara göre, dambıl başına |
| Kademeli yüklenme | Yok | Elle | Otomatik (artır / aynı / hafiflet) |
| Takip | Basit | Güçlü | Önceki değer, rekor, seri, grafik |
| Reklam / ücret | Reklam + abonelik | Pro abonelik | Hiçbiri |
| Türkçe | Var | Kısmen | Ana dil + İngilizce |
| Çevrimdışı | Kısmen | Kısmen | Tamamen |

---

## 3. Uygulanan revizyon (v1.2.0)

### Özellikler
- **5 hazır program** (Başlangıç, Kas Gelişimi, Yağ Yakımı, Güç, 20 dk Kol & Karın), hedef ve seviyeye göre öneri.
  Ana sayfada "Sıradaki antrenman" kartı, tek dokunuşla başlatma, ağırlıklar otomatik dolu.
- **Kademeli yüklenme motoru**: geçen seferki performansa göre artır / tekrar artır / aynı kal / hafiflet.
- **Antrenman ekranı**: önceki değer sütunu, set işaretleyince otomatik dinlenme, sesli koç, titreşim,
  ekran açık kalır, ilerleme çubuğu, uygulama kapansa da yarım antrenman korunur.
- **Antrenman sonu özeti**: süre, hacim, set, kırılan rekorlar, seri, program ilerlemesi.
- **İlerleme ekranı**: haftalık seri, 8 haftalık hacim grafiği, 12 haftalık takvim, kişisel rekorlar.
- **Hatırlatıcı**: gün ve saat seçmeli, internetsiz yerel bildirim.
- **Türkçe + İngilizce** (cihaz diline göre otomatik), **kg + lb** (ABD ölçü sisteminde lb varsayılan).
- **Sehpa / sandalye bilgisi** ve sehpasız alternatif hareket.

### Grafik ve kullanılabilirlik
- Hareket animasyonu: 3 poz döngüsü (başlangıç → orta → bitiş), dokununca durur; "hareketi azalt" ayarına uyar.
- Listelerde hareket küçük görselleri; yeni ana ekran (seri / hafta / toplam kutuları).
- Açık / koyu / sistem teması seçimi.
- Erişilebilirlik: ekran okuyucu etiketleri, 44 px dokunma alanları, başlık rolleri, canlı bölge duyuruları.
- Geri alınamaz işlemler (iptal, geçmişi silme, profili sıfırlama) iki adımlı onaylı.
- Türkçe metinlerde marka ile tutarlı "dambıl".

### Teknik
- Hesap modülleri (ilerleme, yüklenme, program, birim) ayrı ve test edilmiş: 29 test.
- Uçtan uca tarayıcı testi: başlangıç → program → antrenman → özet → ilerleme → dil değişimi, konsol hatası yok.

### ASO (v3)
- TR başlık: **"Dambıl Hareketleri: Evde Spor"** ("dambıl hareketleri" 1.900/ay, düşük rekabet).
- EN başlık: **"Dumbbell Workout Plan at Home"** ("dumbbell workout" 27.100/ay, "… plan" 6.600/ay).
- Kısa açıklamada "Reklamsız" / "No ads"; ilk görselde "Reklamsız • Hesapsız • İnternetsiz".
- 6 yeni görsel × 2 dil, rakip tarzında koyu zemin + büyük harfli başlık.
- Metinler ve gerekçe: `STORE_LISTING.md`.

---

## 4. Sonraki aşamalar

| Öncelik | İş | Neden | Not |
|---|---|---|---|
| 1 | v3 mağaza girişini ve v1.2.0 AAB'yi yayınlamak | Hiçbir aramada çıkmıyoruz | Kullanıcı onayıyla |
| 2 | Ölçüm (kurulum → ilk antrenman → 7. gün dönüş) | Neyin işe yaradığını görmek | Sağlayıcı seçimi kullanıcıda (PostHog / Firebase) |
| 3 | Egzersiz sayısını 24 → 50+ | Rakipler 70–750 egzersiz gösteriyor | Aynı 3 poz yöntemi |
| 4 | Health Connect'e antrenman yazma | Leap yorumlarında isteniyor | Play'de ek sağlık beyanı gerekir |
| 5 | iOS sürümü | Kod ortak, maliyet düşük | Apple geliştirici hesabı gerekir |
| 6 | Hareket başına ağırlık grafiği | Hevy'nin en sevilen özelliği | İlerleme ekranına eklenir |
| 7 | Yorum isteme (3. antrenmandan sonra) | Puan ve sıralama | Play In-App Review |
| 8 | Expo SDK 57'ye yükseltme | SDK 56'daki JavaScript motorunda bilinen bir bellek sorunu var (expo-doctor uyarısı) | Ayrı dalda, testlerle |
| 9 | Abonelik yerine tek seferlik "destek ol" | Gelir, güveni bozmadan | Rakip şikâyetleri bunu gösteriyor |

Hedef tarih: Ocak arama zirvesinden önce (Aralık sonu) 1–3 tamamlanmış olmalı.
