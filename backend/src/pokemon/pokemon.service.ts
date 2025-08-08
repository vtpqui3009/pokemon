import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPokemonDto } from './dto/filter-pokemon.dto';
import { createReadStream } from 'fs';
import csvParser from 'csv-parser';
import { Prisma } from '@prisma/client';

interface CsvRow {
  id: string;
  name: string;
  type1: string;
  type2?: string;
  total: string;
  hp: string;
  attack: string;
  defense: string;
  spAttack: string;
  spDefense: string;
  speed: string;
  generation: string;
  legendary: string;
  image: string;
  ytbUrl: string;
}

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}

  async importPokemonFromCsv(filePath: string) {
    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', async (row) => {
          // Normalize keys and values
          const normalizedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.replace(/^"+|"+$/g, '').trim(), // remove "quotes"
              String(value).trim(), // remove extra space
            ]),
          );

          const safeParseInt = (value: string, fieldName: string): number => {
            const num = parseInt(value.trim());
            if (isNaN(num)) {
              throw new Error(`Invalid number for ${fieldName}: ${value}`);
            }
            return num;
          };

          try {
            const pokemon = await this.prisma.pokemon.create({
              data: {
                name: row.name,
                type1: row.type1,
                type2: row.type2 || null,
                total: safeParseInt(row.total, 'total'),
                hp: safeParseInt(row.hp, 'hp'),
                attack: safeParseInt(row.attack, 'attack'),
                defense: safeParseInt(row.defense, 'defense'),
                spAttack: safeParseInt(row.spAttack, 'spAttack'),
                spDefense: safeParseInt(row.spDefense, 'spDefense'),
                speed: safeParseInt(row.speed, 'speed'),
                generation: safeParseInt(row.generation, 'generation'),
                legendary: row.legendary === 'true',
                imageUrl: row.image,
                youtubeUrl: row.ytbUrl,
              },
            });

            console.log(`Imported: ${pokemon.name}`);
          } catch (error) {
            console.error(`❌ Error importing:`, normalizedRow, error);
          }
        })
        .on('end', () => {
          console.log('✅ Import complete.');
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
  async getPokemonList(filters: FilterPokemonDto) {
    const {
      search,
      type,
      legendary,
      minSpeed,
      maxSpeed,
      page = 1,
      limit = 20,
    } = filters;

    const andFilters: Prisma.PokemonWhereInput[] = [];

    if (search) {
      andFilters.push({
        name: {
          contains: search,
          mode: 'insensitive',
        },
      });
    }

    if (type) {
      andFilters.push({
        OR: [{ type1: type }, { type2: type }],
      });
    }

    if (legendary !== undefined) {
      andFilters.push({ legendary });
    }

    if (minSpeed !== undefined && !isNaN(minSpeed)) {
      andFilters.push({ speed: { gte: minSpeed } });
    }

    if (maxSpeed !== undefined && !isNaN(maxSpeed)) {
      andFilters.push({ speed: { lte: maxSpeed } });
    }

    const where: Prisma.PokemonWhereInput =
      andFilters.length > 0 ? { AND: andFilters } : {};

    const [total, data] = await Promise.all([
      this.prisma.pokemon.count({ where }),
      this.prisma.pokemon.findMany({
        where,
        skip: (page - 1) * Number(limit),
        take: Number(limit),
        orderBy: { id: 'asc' },
      }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / Number(limit)),
    };
  }

  async getPokemonDetail(id: number) {
    return this.prisma.pokemon.findUnique({
      where: { id },
    });
  }

  async addFavorite(userId: number, pokemonId: number) {
    return this.prisma.favorite.create({
      data: {
        userId,
        pokemonId,
      },
    });
  }

  async removeFavorite(userId: number, pokemonId: number) {
    return this.prisma.favorite.delete({
      where: {
        userId_pokemonId: {
          userId,
          pokemonId,
        },
      },
    });
  }

  async getUserFavorites(userId: number) {
    return this.prisma.pokemon.findMany({
      where: {
        favorites: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
