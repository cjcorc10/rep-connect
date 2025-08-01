export type Coordinates = {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
};

export type StateDistricts = {
  state: string;
  districts: string[];
};

export type Rep = {
  id: string;
  name: string;
  party: string;
  state: string;
  district?: string;
  address?: string;
  url?: string;
  image?: string;
  phone?: string;
  additionalContactInfo?: string;
};

export type Representative = {
  id: { bioguide: string };
  name: { official_full: string };
  terms: {
    type: 'sen' | 'rep';
    state: string;
    start: string;
    district?: string;
    end?: string;
    class?: number;
    party: string;
    phone?: string;
    url?: string;
    contact_form?: string;
    address?: string;
  }[];
};
