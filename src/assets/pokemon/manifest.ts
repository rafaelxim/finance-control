export interface PokemonAsset {
  id: string
  pokemonNumber: number
  name: string
  type?: string
  filePath: string
  altText: string
  usage: 'categoryCard' | 'badge' | 'background'
}

export const pokemonAssets: PokemonAsset[] = [
  {
    id: 'pikachu-card',
    pokemonNumber: 25,
    name: 'Pikachu',
    type: 'electric',
    filePath: '/pokemon-assets/official/pikachu.png',
    altText: 'Pikachu em pose de batalha para card de categoria',
    usage: 'categoryCard'
  },
  {
    id: 'bulbasaur-card',
    pokemonNumber: 1,
    name: 'Bulbasaur',
    type: 'grass',
    filePath: '/pokemon-assets/official/bulbasaur.png',
    altText: 'Bulbasaur para card de categoria',
    usage: 'categoryCard'
  },
  {
    id: 'squirtle-card',
    pokemonNumber: 7,
    name: 'Squirtle',
    type: 'water',
    filePath: '/pokemon-assets/official/squirtle.png',
    altText: 'Squirtle para card de categoria',
    usage: 'categoryCard'
  }
]

export function getPokemonAsset(assetId?: string): PokemonAsset | undefined {
  return pokemonAssets.find((asset) => asset.id === assetId) ?? pokemonAssets[0]
}
