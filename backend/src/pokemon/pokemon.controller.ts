import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { FilterPokemonDto } from './dto/filter-pokemon.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Req } from '@nestjs/common';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(JwtAuthGuard)
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `pokemon-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.csv$/)) {
          cb(new Error('Only CSV files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async importPokemon(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('CSV file is required');
    }

    return this.pokemonService.importPokemonFromCsv(file.path);
  }

  @Get()
  getList(@Query() query: FilterPokemonDto) {
    return this.pokemonService.getPokemonList(query);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.pokemonService.getPokemonDetail(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  async markFavorite(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.pokemonService.addFavorite(userId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unfavorite')
  async unmarkFavorite(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.pokemonService.removeFavorite(userId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorites/me')
  async getMyFavorites(@Req() req) {
    const userId = req.user.userId;
    return this.pokemonService.getUserFavorites(userId);
  }
}
