# Google Play rakip analizi: Dambıl Antrenman (com.kerembasbug.dumbbellworkout)

Snapshot date: **2026-11-17**. Sources: the live Google Play web pages (`hl=tr&gl=TR` and `hl=en&gl=US`) for 23 apps, Play search results for 11 queries, about 2,190 one-to-three-star reviews (TR and EN, newest first, up to 40 per star level per app) pulled from Play's public review feed, and screenshots of 8 listings that I viewed. I used a few third-party sources for prices.

**Caveats**
- I ran the searches from a US IP with `gl=TR`. A Turkish device may rank apps differently. Treat the rank order as indicative.
- The rating shown depends on the country. Both values are given where they differ (US / TR).
- I sorted complaints into themes by keyword, so the counts are approximate.
- Anything marked *(unverified)* I could not confirm from a primary source.

---

## 0. Before anything else: our own live listing

The public TR Play page currently shows:

- Title **"Dumbbell Antrenman"**
- Developer "Revoba"
- **5+ installs**
- Last updated **26 Jun 2026**

The v2 ASO listing in `STORE_LISTING.md` ("Dambıl Antrenman: Evde Spor") is **not live on the public page**. It may be unpublished, still in review, or applied to a different listing *(unverified)*.

We do not appear in the results I fetched for "dambıl", "dambıl antrenmanı", "dambıl programı", "evde kas yapma" or "spor programı":

- "dambıl programı" returned 11 results.
- "evde kas yapma" and "spor programı" returned 30 each.
- "dambıl" and "dambıl antrenmanı" returned 11 and 9.

---

## 1. Comparison table

TR-specific search ranks:
- "dambıl" query: Leap Dumbbell #1, AxiomRun #2, LifeBuddy #3, Nexoft #6.
- "evde spor" query: Leap Home Workout #1, Leap Fitness Coach #2.

"Plans / Charts / Remind / Voice" columns: ✓ = has it, ✗ = does not, ~ = partial, — = not checked. In the Voice column, "auto-count" means an automatic voice rep counter.

| App (package) | TR title / EN title | Rating (US/TR) | Reviews | Installs | Monetization (TR price range) | Demo style | Plans | Charts | Remind | Voice | Health Connect / Google Fit | Turkish UI |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Leap: Dumbbell** (dumbbellworkout.dumbbellapp.homeworkout) | Evde Dambıl Egzersizi / Dumbbell Workout at Home | 4.8/4.9 | 192K | 10M+ | Ads + IAP. Remove-ads ₺47,99 one-time (US $5.99) | 3D animation + video | 30-day plan, 3 levels | ✓ (cal/weight/min) | ✓ | ✓ tips, auto-count | ✗ (users ask for HC) | ✓ |
| **Leap: Home Workout** (homeworkout.homeworkouts.noequipment) | Ev Egzersizleri - Ekipmansız / Home Workout - No Equipment | 4.9 | 4.06M | 100M+ | Ads + IAP ($2.99–69.99) | Animation + video | ✓ | ✓ | ✓ | ✓ | Google Fit *(unverified)* | ✓ |
| **Leap: Fitness Coach** (fitnesscoach.workoutplanner.weightloss) | **Evde Spor - Evde Egzersiz** / Fitness Coach: Weight Loss | 4.9 | 311K | 10M+ | Ads + subscription (₺689,99–2.869,99) | Animation + video + YouTube | ✓ 30-day | ✓ | ✓ | ✓ "AI voice" | — | ✓ |
| **AxiomRun** (com.axiommobile.dumbbells) | Dambıl ile Evde Egzersiz / Dumbbell Workout at Home & Gym | 4.7 | 36.4K | 1M+ | Ads + IAP (₺99–999) | Grey 3D-ish figure animation | ✓ ready plan + custom | ✓ (tonnage per muscle) | — | ✓ | Google Fit (per a review) | ✓ |
| **LifeBuddy** (com.tv.lifebuddy) | Dambıl çalışma programı / Dumbbell Home Workout | 4.7 | 29.3K | 1M+ | Ads + **hard subscription** after day 1–2 (₺44,99–2.439,99; a review cites "1 yıllık 480 TL") | Video ("750+ egzersiz") | ✓ | ✓ | ✓ | — | — | ✓ |
| **Nexoft** (dumbbellsworkouts.athome.dailyfitness) | Dambıl Egzersizleri / Dumbbell Workout in 30 days | 4.8 | 15.5K | 500K+ | Ads + IAP (₺28,99–2.089,99) | Video + animation + narration + music | ✓ 30-day, 3 levels | — | ✓ | ✓ | — | ✓ |
| **Activefitapps** (com.muzudre.dumbbell...) | Dumbbell Training App | 4.6/4.8 | 720 | 50K+ | No ads, $5.49 lifetime (₺274,99) | Animation | ✓ 30-day | — | — | beeps | — | listing only |
| **Stark Dumbbell** (se.virtualtrainer.dumbbell) | Stark Dumbbell | 4.3/4.7 | 1.01K | 100K+ | **Paid ₺54,99 / $4.99**. No ads, no IAP, no account | 70 HD videos, real trainer | ✓ | history | — | ✓ | — | ✗ (TR users ask for it) |
| **Ağırsağlam / Lightweight!** (com.lightweight.calculator), Turkish developer | Ağırsağlam Fitness & Egzersiz / Lightweight! Workout Analysis | 4.6/4.8 | 17K | 500K+ | IAP (₺19,90–499,99) | Video + muscle **heat map** | ✓ dozens | ✓ heat map | — | — | — | ✓ |
| **Muscle Monster** (musclemonster...) | Muscle Monster: egzersiz | 4.5/4.7 | 99.6K | 5M+ | Hard paywall (₺274,99–6.729,99) | Demos | ✓ AI | ✓ | ✓ | — | — | ✓ |
| **Muscle Booster** (musclebooster...) | Muscle Booster Workout Planner | 4.4 | 259K | 50M+ | Hard paywall (₺8,99–4.099,99) | Short videos | ✓ AI | ✓ | ✓ | — | — | partial (TR complaints) |
| **MadMuscles** (com.amomedia.madmuscles) | MadMuscles: Workouts & Diet | 4.4/**3.8** | 121K | 1M+ | Hard paywall + upsells (₺139,99–6.609,99) | Video | ✓ + diet | ✓ | ✓ | — | — | listing TR |
| **Fitness Online** (fitness.online.app) | Fitness, Evde Spor & Kas Yapma / Fitness App: Gym Workout Plan | 4.5/4.7 | 83.2K | 5M+ | IAP/sub (₺159,99–1.399,99) | 3D | ✓ | ✓ | — | — | — | ✓ |
| **Hevy** (com.hevy) | Hevy - Spor, Vücut Geliştirme / Hevy - Gym Log Workout Tracker | 4.9 | 291K | 5M+ | Free, no ads. Pro $2.99/mo, lifetime $74.99 (₺19,99–499,99) | 200+ videos/animations | routines | ✓ (long-term charts are Pro) | — | — | HC writes workouts *(3rd-party source)*. Wear OS ✓ | ✓ (App Store lists Turkish) |
| **Strong** (io.strongapp.strong) | Strong Workout Tracker Gym Log | 4.3/4.5 | 42.8K | 1M+ | Free tier limited to 3 routines. Pro ~$4.99/mo, $29.99/yr, $99.99 lifetime *(3rd-party)* | Coaching animations | templates | ✓ volume/1RM | — | — | Google Fit (body measurements) | *(unverified)* |
| **JEFIT** (je.fit) | JEFIT-Gym Workout Tracker | 4.4/4.3 | 90K | 5M+ | Elite $12.99/mo, $69.99/yr (from the store description) | 1,400+ HD videos/animations | ✓ AI adaptive | ✓ muscle map, recovery | — | — | Wear OS, widget | historically ✗ (many TR complaints) |
| **Fitbod** (com.fitbod.fitbod) | Fitbod: Workout & Gym Planner | 4.5/**4.1** | 32K | 1M+ | No free tier. ~$15.99/mo, $95.99/yr *(3rd-party)* | Multi-angle HD video | ✓ AI | ✓ | — | — | Wear OS | ✗ (TR review, Oct 2025) |

Stale or small dambıl-titled apps (they still rank for "dambıl", which shows how thin this niche is):

| App | Installs | Last update | Notes |
|---|---|---|---|
| powerpunch "Evde Dambıl Egzersizi" | 10K+ | Nov 2024 | |
| Steveloper "Dambıl ile Çalışma Programı" | 50K+ | Oct 2024 | 3.7★ in TR |
| World Gym "Dambıl Egzersizi - Egzersiz" | 10K+ | May 2024 | |
| FitnessZone "Dumbbell Workout at Home" | 1K+ | — | Shows GIFs |
| RadKod "Dambıl Life" | 1K+ | — | Turkish gym/PT tracker. Not a direct competitor, but uses the "Dambıl" brand word |

---

## 2. Notes on each competitor

**Leap Dumbbell (the main rival for "dambıl")**
- Fully localized for Turkish. The screenshots show Turkish UI ("DEVAM ET", "DURAKSAT").
- Features: 30-day plans with 3 levels, two exercise databases (dumbbell and bodyweight), "personalized plan" based on goal, gender and focus area, 3D coach character, speed and rounds settings, reminders, calendar, calorie/BMI/weight reports.
- Workouts run on a timer with **voice auto-counting**.
- There is **no per-exercise weight entry**. A 3★ EN review says: "you can only enter a weight for the whole workout".
- Ads are its #1 problem: 50 of the 219 low-star reviews I sampled mention them.

**AxiomRun ("Dambıl ile Evde Egzersiz")**
- Functionally our closest rival. It is kg-based: the screenshots show "8 kg / 12 tekrar", a per-day exercise list with kg, tonnage per muscle and a weekly volume chart.
- Screenshots are raw grayscale with **no captions**, which is the weakest presentation in the category.
- Complaints:
  - The default weights are too high: "Beginner adama 6 kg ile lateral raise".
  - It is unclear whether the weight is per dumbbell or the total: "6 KG ağırlık diyor toplam ağırlık mı 1 dumbel mı?".
  - Weight changes have to be made in settings.
  - Too few exercises.
  - Paywall at ₺499.

**LifeBuddy ("Dambıl çalışma programı")**
- Aggressive subscription: users say they are blocked after the 1st or 2nd workout.
- A "Plan oluşturamıyorum / Hata" error at the plan-creation step recurs across 2023–2024.
- Workouts are time-based, which a review says makes progressive overload hard to track.
- It has the strongest TR screenshot set: black and orange, huge bold captions, before/after photos, and a "Neden dambıllar kazanır" comparison table.

**Nexoft ("Dambıl Egzersizleri")**
- Video plus narration plus music, 3 levels, about 300 exercises.
- The first screenshot uses a social-proof badge ("500K+ Mutlu Kullanıcı, 4.8").
- A TR review asks for starting-weight guidance: "başlangıç ağırlık miktarlarını belirtirse daha iyi olur".

**Stark Dumbbell**
- The nearest match to our positioning: no ads, no IAP, no account, a **tap-a-muscle map**, build-your-own workouts, light and dark themes.
- It costs ₺54,99 and has **no Turkish UI** (TR reviews: "türkçe dil desteği olsa", "Languga TR ?").
- Screenshots are minimal and light grey: a small eyebrow label plus a 2-line headline with a blue accent.

**Ağırsağlam / Lightweight!**
- A Turkish developer whose YouTube coaches are well known.
- Muscle heat map, set/kg/RIR logging, video library, ready programs.
- Gym-focused and not built around dumbbells, but it owns the "see which muscles you work" story in Turkish.
- Screenshots are dark red and black with 2-line Turkish captions.

**Muscle Monster / Muscle Booster / MadMuscles**
- Paywall-first AI planners. Their reviews are dominated by billing anger:
  - Hidden upsells, e.g. "charged an additional 34.95 for an ebook".
  - MadMuscles TR: "aylık 9,99 $ … kartınızdan 6 kat fazla para çekiyorlar".
- MadMuscles has a **3.8 rating in TR**.

**Hevy, Strong, JEFIT, Fitbod**
- Gym loggers that do not target dambıl or home users.
- Hevy is free, ad-free and Turkish-localized. Its TR screenshots ("AĞIRLIKLARI TAKİP ET", "ANTRENMANINI KAYDET/ANALİZ ET/PLANLA") make **kg and PR charts** the hero.
- Their low-star reviews are about UI changes (Hevy's new number pad), forced accounts and logins (Strong), free-tier limits (Strong allows 3 routines; Hevy allows 7 custom exercises), and missing Turkish (JEFIT, Fitbod).

---

## 3. Recurring complaints (from about 2,190 one-to-three-star reviews across 15 apps)

| # | Theme | Mentions | Where it concentrates | Representative quotes |
|---|---|---|---|---|
| 1 | Paywall / price / "free then pay" | 512 | Muscle Monster 79, MadMuscles 74, Muscle Booster 73, Fitbod 61, LifeBuddy 51 | "Baştan söyleseydin ya 2. günden sonra ücret isteyeceğim diye" (LifeBuddy). "Para istiyor daha Bismillah demeden" (Axiom) |
| 2 | Bugs, crashes, login, sync | 192 | JEFIT 30, Hevy 24, LifeBuddy 23, Strong 23 | "Plan oluştururken hata veriyor" (LifeBuddy). "CAN'T RESET MY PASSWORD" (Strong) |
| 3 | Billing, unexpected charges, refunds | 171 | MadMuscles 64, Muscle Booster 39, Muscle Monster 29 | "kredi kartınız boşalabilir!" (MadMuscles TR) |
| 4 | Ads (long, unskippable, malicious redirects, sexual content) | 131 | Leap Dumbbell 50, Leap Home 24, Nexoft 17 | "bi reklam giriyo bitmiyor bitmiyor". "Silkik azar ve diğer cinsel içerikli reklamlar". "Ads redirect me to the site without me touching anything" |
| 5 | Forced timer / auto-counting / too fast | 79 | Leap Dumbbell 13, Leap Home 10 | "lütfen şu sayacı kaldırın… hareketli animasyonun hızında yapamıyorum". "No option to disable auto counting?". "Dinlenme süresi çok kısa" |
| 6 | Turkish language missing | 46 | JEFIT 19, Muscle Booster 14, Leap (2020, since fixed), Stark, Fitbod | "Türkçe dil desteği gelse… premium kesinlikle alırdım" (Fitbod) |
| 7 | Repetitive / too few exercises | 39 | Leap, Axiom | "her programda ilk 4 hareketten sonra aynı hareketleri gösteriyor". "Sadece her gün aynı şeyleri yapıyorsunuz" |
| 8 | Plan ignores preferences or has a poor split | ~15+ | Leap | "bacak çalışmak istemiyorum dediğim halde hala bacak". "her gün egzersiz var, salon haftada 3 gün diyor". Users ask for a split like "1. gün göğüs + ön kol, 2. gün sırt…" |
| 9 | **Dumbbell weight guidance and customization** | 15 (rare but very specific) | Axiom, Leap, Activefit, LifeBuddy | "6 KG… toplam ağırlık mı 1 dumbel mı?". "Beginner adama 6 kg ile lateral raise". "didn't tell me what weight I should use". "Невозможно настроить и сохранить веса для каждого упражнения" (Leap). "change dumbbell weight for all… and the reps should change accordingly" (Axiom) |
| 10 | Equipment and injury alternatives | ~10 | Leap, Axiom | "bench yok". "omuz sakatlığı… alternatif hareketler yok". "ELİMDE OLMAYAN ALETLERLE YAPTIRMAYA ÇALIŞIYOR" |
| 11 | Needs internet / data / Health Connect | 21 | Leap | "2. güne internet ağı istiyor". "you need to give health connect!" |

---

## 4. ASO patterns

**Turkish titles: words that rank for "dambıl"**
- "Dambıl" appears in 7 of the top 11 titles.
- The other tokens:
  - "Egzersiz/Egzersizi/Egzersizleri": 5 titles
  - "Evde": 3 titles
  - "Çalışma Programı": 2 titles
  - "ile": 3 titles
- Exact duplicates: Leap and powerpunch both use **"Evde Dambıl Egzersizi"**.
- **"Evde Spor"** belongs to Leap Fitness Coach ("Evde Spor - Evde Egzersiz", 10M+).
- "Antrenman" is almost unused in dambıl titles (Hevy and our app only). It differentiates us, but "egzersiz" and "program" carry the volume.

**Turkish short descriptions**
- Leap: "Dambıl çalışma programları ile evde kas yaparak güçlenin, forma girin."
- Axiom: "Tek ihtiyacınız olan bir çift dambıl."
- LifeBuddy: "Dambıl egzersizleri ile hızlı kas yapma"
- Nexoft: "Evde ücretsiz kas geliştirme egzersizi, tüm vücut geliştirme dambıl hareketleri"
- Recurring words: *kas yap(ma), evde, program(ı), güçlen, vücut geliştirme, ücretsiz, tüm vücut*.

**English titles and short descriptions**
- **"Dumbbell Workout at Home"** is the exact title of 4 apps.
- Modifiers: "30 days", "Home & Gym", "Plan", "Bodybuilding".
- Tracker vocabulary: "Gym Log", "Workout Tracker", "Planner", "Weight Lifting".
- Short descriptions lead with *build muscle, strength, at home, 30-day, full body*.

**Screenshot caption themes (TR)**
- Bold uppercase Turkish captions of 2–4 words over dark backgrounds (black, teal, orange or red), with muscular models.
- Recurring captions:
  - "30 GÜNLÜK PLAN"
  - "3 FARKLI SEVİYE"
  - "ODAKLANAN BÖLGELER"
  - "VİDEOLU TALİMATLAR"
  - "İLERLEMEYİ GÖR"
  - "Kişiselleştirilmiş Plan"
  - "Ekipman Yok"
  - "750+ EGZERSİZ"
- Other recurring elements: a social-proof badge (500K+, 4.8) on frame 1, before/after photos (LifeBuddy), muscle-map frames (Leap, Stark, Ağırsağlam), and kg/PR charts (Hevy).
- Exceptions: Axiom uses no captions, and Stark uses a minimal light theme.

---

## 5. Opportunities for us (ranked)

1. **Get the v2 listing live, then re-check rank.**
   - The public page still shows "Dumbbell Antrenman" with 5+ installs. No other step matters until the title "Dambıl Antrenman: Evde Spor" and the dambıl-heavy short description are actually published.
   - The "dambıl" result set is thin: 4 of the 11 apps have under 50K installs or haven't been updated since 2024. A fresh, well-rated app with "Dambıl" in the title can reach the top 5.

2. **Make "which weight?" the core message.** Nobody in the category tells a beginner which kg to use with *their own* dumbbells, and that is exactly what we compute.
   - In screenshots and the short description, use lines like "Elindeki dambıla göre: 5 kg → 12 tekrar" and "Hangi ağırlıkla başlamalıyım?".
   - Always state "**tek dambıl** başına kg". This directly fixes Axiom's "toplam mı, tek mi?" confusion.
   - Allow saving a weight per exercise. Leap and Axiom users explicitly ask for it.

3. **"Reklamsız • Hesapsız • İnternetsiz" as a headline.**
   - Ads are the #1 complaint about the #1 dambıl app (Leap). Surprise paywalls and charges are #1 and #3 across the category.
   - Put it in screenshot frame 1 and the short description.
   - Keep "ücretsiz" and other promo words out of the title (Play metadata policy). Stating features such as "reklamsız" in the description is fine.

4. **Add simple ready programs.**
   - Every top dambıl app markets "30 günlük plan / 3 seviye", and both "çalışma programı" and "dambıl programı" are title keywords. Without plans we miss that intent.
   - A 3-day/week split (Başlangıç / Orta) is enough. It answers the Leap and Axiom complaints about every-day training and wanting a "1. gün göğüs…" split.
   - The rule users asked for: rest days, and no exercises from areas the user excluded.

5. **Per-exercise progress chart, PRs and "next time +1 tekrar / +kg" suggestions.**
   - We already log sets, reps and volume, so this costs little.
   - It turns history into progressive overload, the thing time-based apps (Leap, LifeBuddy) can't offer.
   - It also gives a Hevy-style "İLERLEMENİ GÖR" screenshot.

6. **Let the user set the pace.**
   - Make it explicit: no forced timer, no robot counting, "Seti bitirince işaretle", adjustable rest.
   - This answers Leap's #2 complaint cluster. We already work this way, so the work is mainly to say it in the listing.

7. **Local workout reminders, offline.** Leap and Nexoft treat reminders as table stakes. They are cheap to add and keep us fully offline.

8. **Equipment and safety filters.**
   - Mark exercises that need a bench and offer a no-bench alternative.
   - Add an "omuz/bel hassasiyeti" filter that hides risky moves.
   - These come straight from Leap and Axiom reviews.

9. **Better exercise demonstrations at low cost.**
   - Auto-loop our 3 frames (start → middle → end) as a pseudo-animation.
   - Add tips like "breathe here" and "don't lock the elbow" (requests from Ağırsağlam and Axiom reviews).
   - Video and 3D are the norm, but static frames that move cover most of the perceived gap.

10. **Health Connect export (write workouts).** Leap users ask for it and Hevy offers it. Medium effort, and it appeals to Samsung Health users.

11. **Screenshot refresh to match category norms.**
    - Bold uppercase TR captions of 2–4 words on a dark background.
    - Show real kg numbers on screen, as Axiom and Hevy do.
    - Frame 1 should carry the value proposition ("Elindeki Dambıla Göre Program" + "Reklamsız").
    - Feature the muscle map, as Stark and Ağırsağlam do.
    - Add a social-proof badge once ratings exist.

12. **An English listing later.** The "Dumbbell Workout at Home" space is saturated with identical titles. Stay TR-first. The no-ads, offline, weight-aware angle is the only realistic wedge in English.

### Unverified items
- Health Connect support for Leap, Hevy (only a third-party source) and Strong.
- Exact prices for Strong, Fitbod and Hevy plans: they come from third-party pages, while the Play IAP ranges above are primary.
- Whether Strong has a Turkish UI.
- Whether JEFIT has a Turkish UI today.
- Dark-mode settings, except Stark (stated in its listing) and JEFIT (a review).
- Search ranks as seen from a real Turkish device.
- Why our v2 listing is not visible.
