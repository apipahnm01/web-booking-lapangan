import { useEffect, useState } from 'react';
import { COURTS } from './constants';
import { supabase } from './supabase';
import type { Court } from './types';

export function usePublicCourts() {
  const [courts, setCourts] = useState<Court[]>(COURTS);

  useEffect(() => {
    let active = true;
    async function loadCourts() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('courts')
        .select('id, name, sport, price_per_hour, is_active')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (!active || error || !data) return;
      setCourts(data.map(c => ({
        id: c.id,
        name: c.name,
        sport: c.sport,
        pricePerHour: Number(c.price_per_hour),
      })));
    }
    void loadCourts();
    return () => { active = false; };
  }, []);

  return courts;
}
