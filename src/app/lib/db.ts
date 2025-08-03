import { supabase } from './supabase/supabaseClient';

export const getSenators = async (state: string) => {
  const { data, error } = await supabase
    .from('legislators')
    .select('*')
    .eq('state', state)
    .eq('type', 'sen');

  if (error) {
    throw new Error('Failed to retrieve senators');
  }
  return data;
};

export const getHouseReps = async (
  district: string[],
  state: string
) => {
  const { data, error } = await supabase
    .from('legislators')
    .select('*')
    .in('district', district)
    .eq('state', state);

  if (error) {
    throw new Error('Failed to retrieve representatives');
  }
  return data;
};

export const fetchRep = async (id: string) => {
  const { data, error } = await supabase
    .from('legislators')
    .select('*')
    .eq('bioguide', id)
    .single();

  if (error) {
    throw new Error('Failed to retrieve representative');
  }
  return data;
};
