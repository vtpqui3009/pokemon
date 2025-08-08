export interface PaginatedPokemon {
  data: Array<Pokemon>;
  lastPage: number;
  page: number;
  total: number;
}

export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2?: string;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  imageUrl: string;
  youtubeUrl: string;
}

export interface PokemonFilters {
  search?: string;
  type?: string;
  legendary?: boolean;
  minSpeed?: number;
  maxSpeed?: number;
  page?: number;
  limit?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
