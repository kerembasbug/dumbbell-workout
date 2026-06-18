import { describe, expect, it } from '@jest/globals';

import { EXERCISE_BY_ID } from '@/data/exercises';
import {
  GOAL_SCHEME,
  nearestOwned,
  recommendRepsForWeight,
  recommendWeight,
  buildInitialSets,
} from '@/domain/recommend';
import type { UserProfile } from '@/domain/types';

const baseProfile: UserProfile = {
  goal: 'hypertrophy',
  experience: 'intermediate',
  sex: 'male',
  weightKg: 80,
  heightCm: 180,
  ownedDumbbellsKg: [],
  units: 'metric',
};

const bench = EXERCISE_BY_ID['db-bench-press'];
const curl = EXERCISE_BY_ID['biceps-curl'];

describe('nearestOwned', () => {
  it('boş listede null döner', () => {
    expect(nearestOwned(10, [])).toBeNull();
  });
  it('en yakın ağırlığa yuvarlar', () => {
    expect(nearestOwned(11, [5, 10, 15])).toBe(10);
    expect(nearestOwned(13, [5, 10, 15])).toBe(15);
  });
  it('0 ve negatifleri yok sayar', () => {
    expect(nearestOwned(8, [0, -5, 7.5, 12.5])).toBe(7.5);
  });
});

describe('recommendWeight', () => {
  it('referans kullanıcıda baseLoadFactor * bodyweight üretir', () => {
    // 80kg * 0.27 * 1.0 * 1.0 * 1.0 = 21.6
    const r = recommendWeight(baseProfile, bench);
    expect(r.rawKg).toBeCloseTo(21.6, 1);
  });

  it('acemi kullanıcı için daha hafif önerir', () => {
    const beginner = recommendWeight({ ...baseProfile, experience: 'beginner' }, bench);
    const advanced = recommendWeight({ ...baseProfile, experience: 'advanced' }, bench);
    expect(beginner.rawKg).toBeLessThan(advanced.rawKg);
  });

  it('kadın için erkekten daha hafif önerir', () => {
    const female = recommendWeight({ ...baseProfile, sex: 'female' }, bench);
    const male = recommendWeight({ ...baseProfile, sex: 'male' }, bench);
    expect(female.rawKg).toBeLessThan(male.rawKg);
  });

  it('güç hedefi hipertrofiden daha ağır önerir', () => {
    const strength = recommendWeight({ ...baseProfile, goal: 'strength' }, bench);
    const hyper = recommendWeight({ ...baseProfile, goal: 'hypertrophy' }, bench);
    expect(strength.rawKg).toBeGreaterThan(hyper.rawKg);
  });

  it('sahip olunan dumbbell varsa en yakınına yuvarlar', () => {
    const r = recommendWeight({ ...baseProfile, ownedDumbbellsKg: [10, 12.5, 15, 20] }, bench);
    expect(r.matchedOwned).toBe(true);
    expect([20]).toContain(r.weightKg); // 21.6 -> 20
  });

  it('sahip olunan yoksa makul kademeye yuvarlar', () => {
    const r = recommendWeight(baseProfile, curl);
    expect(r.matchedOwned).toBe(false);
    // 80*0.15 = 12 -> tam sayı
    expect(r.weightKg).toBe(12);
  });

  it('hedefe uygun set/tekrar şeması döner', () => {
    const r = recommendWeight({ ...baseProfile, goal: 'endurance' }, bench);
    expect(r.scheme).toEqual(GOAL_SCHEME.endurance);
  });
});

describe('recommendRepsForWeight', () => {
  it('uygun ağırlıkta hedef tekrar aralığını korur', () => {
    const ideal = recommendWeight(baseProfile, bench).rawKg;
    const r = recommendRepsForWeight(baseProfile, bench, ideal);
    expect(r.verdict).toBe('good');
    expect(r.repRange).toEqual(GOAL_SCHEME.hypertrophy.repRange);
  });

  it('çok hafif ağırlıkta tekrarı artırır ve uyarır', () => {
    const r = recommendRepsForWeight(baseProfile, bench, 2);
    expect(r.verdict).toBe('tooLight');
    expect(r.reps).toBeGreaterThan(GOAL_SCHEME.hypertrophy.repRange[1]);
  });

  it('çok ağır ağırlıkta tekrarı azaltır ve uyarır', () => {
    const r = recommendRepsForWeight(baseProfile, bench, 60);
    expect(r.verdict).toBe('tooHeavy');
    expect(r.reps).toBeLessThan(GOAL_SCHEME.hypertrophy.repRange[0]);
  });
});

describe('buildInitialSets', () => {
  it('şemadaki set sayısı kadar kayıt üretir', () => {
    const sets = buildInitialSets(20, GOAL_SCHEME.strength);
    expect(sets).toHaveLength(GOAL_SCHEME.strength.sets);
    expect(sets[0]).toMatchObject({ weightKg: 20, done: false });
  });
});
