import type { BodyRegion, Exercise } from '@/domain/types';

/**
 * v1 dumbbell egzersiz veri tabanı. Tüm bölgeleri kapsar.
 * `baseLoadFactor`: referans kullanıcı (orta seviye, erkek, hipertrofi hedefi) için
 * dumbbell başına önerilen ağırlığın vücut ağırlığına oranı. Öneri motoru bunu ölçekler.
 */
export const EXERCISES: Exercise[] = [
  // ---------------- GÖĞÜS ----------------
  {
    id: 'db-bench-press',
    name: 'Dumbbell Bench Press',
    regions: ['chest', 'triceps', 'shoulders'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.27,
    steps: [
      'Sırt üstü bir bench veya yere uzanın, her elde bir dumbbell.',
      'Dumbbell’ları göğüs hizasında, dirsekler ~45° açıyla tutun.',
      'Nefes vererek dumbbell’ları yukarı, kollar tam açılana kadar itin.',
      'Kontrollü şekilde başlangıç pozisyonuna indirin.',
    ],
    tips: ['Bel boşluğunu koruyun, omuzları geriye sabitleyin.', 'Dirsekleri kilitlemeyin.'],
  },
  {
    id: 'db-floor-press',
    name: 'Dumbbell Floor Press',
    regions: ['chest', 'triceps'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.25,
    steps: [
      'Yere sırt üstü uzanın, dizler bükülü, her elde dumbbell.',
      'Dumbbell’ları göğüs hizasında tutun.',
      'Yukarı doğru itin, kollar açılsın.',
      'Dirsekler yere değene kadar indirin, kısa duraklayın.',
    ],
    tips: ['Bench yoksa göğüs için güvenli alternatif.', 'Hareketi yavaş ve kontrollü yapın.'],
  },
  {
    id: 'db-fly',
    name: 'Dumbbell Fly',
    regions: ['chest'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.13,
    steps: [
      'Sırt üstü uzanın, dumbbell’ları göğüs üzerinde, avuçlar karşılıklı.',
      'Dirsekleri hafif bükülü tutarak kolları yanlara açın.',
      'Göğüste gerilme hissedince geri toplayın.',
    ],
    tips: ['Hafif ağırlıkla başlayın.', 'Dirsek açısını sabit tutun.'],
  },

  // ---------------- SIRT ----------------
  {
    id: 'one-arm-row',
    name: 'One-Arm Dumbbell Row',
    regions: ['back', 'biceps'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.3,
    steps: [
      'Bir diz ve eli bench/sandalyeye koyun, sırt yere paralel.',
      'Diğer elde dumbbell, kol aşağı uzanmış.',
      'Dirseği gövde boyunca yukarı çekin, kürek kemiğini sıkın.',
      'Kontrollü indirin. Set bitince taraf değiştirin.',
    ],
    tips: ['Sırtı düz tutun, gövdeyi döndürmeyin.', 'Çekişi kasla, momentumla değil.'],
  },
  {
    id: 'bent-over-row',
    name: 'Bent-Over Dumbbell Row',
    regions: ['back', 'biceps'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.22,
    steps: [
      'Ayaklar omuz genişliğinde, dizler hafif bükülü, gövde öne eğik.',
      'Her elde dumbbell, kollar aşağı sarkık.',
      'Dumbbell’ları kaburgalara doğru çekin, dirsekler geriye.',
      'Kontrollü indirin.',
    ],
    tips: ['Belden değil kalçadan eğilin.', 'Sırtı nötr tutun.'],
  },
  {
    id: 'db-pullover',
    name: 'Dumbbell Pullover',
    regions: ['back', 'chest'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.2,
    steps: [
      'Sırt üstü uzanın, tek dumbbell’ı iki elle göğüs üzerinde tutun.',
      'Kolları hafif bükülü tutarak başın arkasına doğru indirin.',
      'Sırtta gerilme hissedince kontrollü geri getirin.',
    ],
    tips: ['Bel boşluğunu abartmayın.', 'Yavaş tempo.'],
  },

  // ---------------- OMUZ ----------------
  {
    id: 'shoulder-press',
    name: 'Dumbbell Shoulder Press',
    regions: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.2,
    steps: [
      'Oturarak veya ayakta, dumbbell’ları omuz hizasında tutun.',
      'Avuçlar öne bakacak şekilde yukarı itin.',
      'Kollar tam açılınca kontrollü indirin.',
    ],
    tips: ['Beli aşırı kavislemeyin.', 'Karnı sıkın.'],
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    regions: ['shoulders'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.1,
    steps: [
      'Ayakta, her elde dumbbell, kollar yanlarda.',
      'Dirsekleri hafif bükülü tutarak kolları omuz hizasına kaldırın.',
      'Kontrollü indirin.',
    ],
    tips: ['Hafif ağırlık kullanın.', 'Omuzları kulağa doğru kaldırmayın.'],
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    regions: ['shoulders'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.1,
    steps: [
      'Ayakta, dumbbell’lar uyluk önünde.',
      'Bir veya iki kolu öne, omuz hizasına kaldırın.',
      'Kontrollü indirin.',
    ],
    tips: ['Gövdeyi sallamayın.', 'Hareketi yavaş yapın.'],
  },

  // ---------------- BICEPS ----------------
  {
    id: 'biceps-curl',
    name: 'Dumbbell Biceps Curl',
    regions: ['biceps'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.15,
    steps: [
      'Ayakta, dumbbell’lar yanlarda, avuçlar öne.',
      'Dirsekleri sabit tutarak ağırlıkları omuza doğru bükün.',
      'Tepede kasıp kontrollü indirin.',
    ],
    tips: ['Dirsekleri gövdeye sabitleyin.', 'Sallanmayın.'],
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    regions: ['biceps'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.15,
    steps: [
      'Avuçlar karşılıklı (çekiç tutuşu), dumbbell’lar yanlarda.',
      'Dirsekleri sabit tutarak yukarı bükün.',
      'Kontrollü indirin.',
    ],
    tips: ['Ön kolu da çalıştırır.', 'Bilek nötr kalsın.'],
  },
  {
    id: 'concentration-curl',
    name: 'Concentration Curl',
    regions: ['biceps'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.12,
    steps: [
      'Oturun, dirseği iç uyluğa dayayın.',
      'Dumbbell’ı yukarı bükün, biceps’i sıkın.',
      'Kontrollü indirin. Taraf değiştirin.',
    ],
    tips: ['İzole hareket, hafif ağırlık.', 'Tepede 1 sn duraklayın.'],
  },

  // ---------------- TRICEPS ----------------
  {
    id: 'overhead-triceps-ext',
    name: 'Overhead Triceps Extension',
    regions: ['triceps'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.18,
    steps: [
      'Tek dumbbell’ı iki elle baş üstünde tutun.',
      'Dirsekleri sabit tutarak ağırlığı başın arkasına indirin.',
      'Triceps’i kasarak yukarı kaldırın.',
    ],
    tips: ['Dirsekleri içe sabitleyin.', 'Yavaş indirin.'],
  },
  {
    id: 'triceps-kickback',
    name: 'Triceps Kickback',
    regions: ['triceps'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.1,
    steps: [
      'Gövde öne eğik, üst kollar gövdeye paralel.',
      'Ön kolu geriye doğru açın, kolu tam uzatın.',
      'Kontrollü geri getirin.',
    ],
    tips: ['Üst kol sabit kalsın.', 'Hafif ağırlık.'],
  },

  // ---------------- BACAK ----------------
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    regions: ['legs', 'core'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.35,
    steps: [
      'Tek dumbbell’ı göğüs önünde dik tutun.',
      'Ayaklar omuz genişliğinde, kalçayı geriye iterek çömelin.',
      'Uyluklar yere paralel olunca topuklarla itip kalkın.',
    ],
    tips: ['Sırt düz, göğüs dik.', 'Dizler ayak uçlarıyla aynı yönde.'],
  },
  {
    id: 'db-lunge',
    name: 'Dumbbell Lunge',
    regions: ['legs'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.2,
    steps: [
      'Her elde dumbbell, kollar yanlarda.',
      'Bir adım öne çıkın, arka diz yere yaklaşana kadar inin.',
      'Öne çıkan topukla itip kalkın. Taraf değiştirin.',
    ],
    tips: ['Gövdeyi dik tutun.', 'Öndeki diz ayak ucunu geçmesin.'],
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlift',
    regions: ['legs', 'back'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.3,
    steps: [
      'Ayakta, dumbbell’lar uyluk önünde.',
      'Dizleri hafif bükülü tutarak kalçadan öne eğilin.',
      'Dumbbell’lar baldır boyunca inerken sırtı düz tutun.',
      'Kalçayı öne iterek kalkın, glute’ları sıkın.',
    ],
    tips: ['Bel değil kalça hareketi.', 'Sırtı yuvarlamayın.'],
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise',
    regions: ['legs'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.3,
    steps: [
      'Her elde dumbbell, ayakta dik durun.',
      'Topukları kaldırıp parmak uçlarında yükselin.',
      'Tepede kasıp kontrollü inin.',
    ],
    tips: ['Tepede 1 sn duraklayın.', 'Tam hareket açıklığı.'],
  },

  // ---------------- KARIN ----------------
  {
    id: 'russian-twist',
    name: 'Weighted Russian Twist',
    regions: ['core'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.12,
    steps: [
      'Oturun, dizler bükülü, gövde hafif geriye yatık.',
      'Tek dumbbell’ı iki elle tutun.',
      'Gövdeyi sağa-sola döndürün, ağırlığı kalçanın yanına götürün.',
    ],
    tips: ['Hareketi karından kontrol edin.', 'Sırtı yuvarlamayın.'],
  },
  {
    id: 'weighted-crunch',
    name: 'Weighted Crunch',
    regions: ['core'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.12,
    steps: [
      'Sırt üstü uzanın, dizler bükülü, dumbbell’ı göğüste tutun.',
      'Üst gövdeyi kaldırarak karnı kasın.',
      'Kontrollü inin.',
    ],
    tips: ['Boynu zorlamayın.', 'Hareketi karından başlatın.'],
  },
  {
    id: 'side-bend',
    name: 'Dumbbell Side Bend',
    regions: ['core'],
    equipment: 'dumbbell',
    mode: 'single',
    baseLoadFactor: 0.2,
    steps: [
      'Ayakta, tek elde dumbbell, diğer el belde.',
      'Gövdeyi dumbbell tarafına doğru yana eğin.',
      'Yan karnı kasarak geri doğrulun. Taraf değiştirin.',
    ],
    tips: ['Yalnızca yana hareket, öne eğilmeyin.', 'Kontrollü tempo.'],
  },

  // ---------------- TÜM VÜCUT ----------------
  {
    id: 'db-thruster',
    name: 'Dumbbell Thruster',
    regions: ['fullbody', 'legs', 'shoulders'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.18,
    steps: [
      'Dumbbell’lar omuz hizasında, ayakta.',
      'Squat pozisyonuna inin.',
      'Kalkarken hareketin momentumuyla dumbbell’ları baş üstüne itin.',
      'İndirip tekrarlayın.',
    ],
    tips: ['Squat ve press tek akıcı harekette.', 'Çekirdeği sıkı tutun.'],
  },
  {
    id: 'renegade-row',
    name: 'Renegade Row',
    regions: ['fullbody', 'back', 'core'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.16,
    steps: [
      'Şınav pozisyonu, eller dumbbell’ların üzerinde.',
      'Çekirdeği sabit tutarak bir dumbbell’ı kaburgaya çekin.',
      'İndirip diğer tarafa geçin.',
    ],
    tips: ['Kalçayı sabit tutun, dönmeyin.', 'Ayakları geniş açın (denge).'],
  },
  {
    id: 'db-deadlift',
    name: 'Dumbbell Deadlift',
    regions: ['fullbody', 'legs', 'back'],
    equipment: 'dumbbell',
    mode: 'pair',
    baseLoadFactor: 0.32,
    steps: [
      'Dumbbell’lar ayakların yanında veya önünde, yerde.',
      'Kalçadan eğilip dumbbell’ları kavrayın, sırt düz.',
      'Topuklarla itip kalçayı öne sürerek ayağa kalkın.',
      'Kontrollü indirin.',
    ],
    tips: ['Sırtı düz tutun.', 'Ağırlığı vücuda yakın tutun.'],
  },
];

export const EXERCISE_BY_ID: Record<string, Exercise> = EXERCISES.reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<string, Exercise>,
);

export function exercisesForRegion(region: BodyRegion): Exercise[] {
  return EXERCISES.filter((e) => e.regions.includes(region));
}

export function getExercise(id: string): Exercise | undefined {
  return EXERCISE_BY_ID[id];
}
