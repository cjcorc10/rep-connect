import { supabase } from './supabase/supabaseClient';

export const getSenators = async (state: string) => {
  const { data, error } = await supabase
    .from('legislators-current')
    .select('*')
    .eq('state', state)
    .eq('type', 'sen');

  if (error) {
    throw new Error('Failed to retrieve senators');
  }
  return data;
};

export const getHouseReps = async (
  districts: string[],
  state: string
) => {
  const { data, error } = await supabase
    .from('legislators-current')
    .select('*')
    .in('district', districts)
    .eq('state', state);

  if (data && data.length === 0) {
    console.error(
      'No representatives found for the given district and state'
    );
    return null;
  } else if (error) {
    throw new Error('Failed to retrieve representatives');
  }
  return data;
};

export const fetchRep = async (id: string) => {
  const { data, error } = await supabase
    .from('legislators-current')
    .select('*')
    .eq('bioguide_id', id)
    .single();

  if (error) {
    throw new Error('Failed to retrieve representative');
  }
  console.log('Fetched rep data:', data);
  return data;
};
