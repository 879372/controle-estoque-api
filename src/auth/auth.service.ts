import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    console.log(jwtConfiguration);
  }

  async login(loginDto: LoginDto) {
    let passwordValid = false;
    let error = true;

    const usuario = await this.usuarioRepository.findOneBy({
      email: loginDto.email,
    });

    if (usuario) {
      passwordValid = await this.hashingService.comparePassword(
        loginDto.password,
        usuario.password,
      );
    }

    if (passwordValid) {
      error = false;
    }

    if (error) {
      throw new UnauthorizedException('Usuário ou senha inválido');
    }

    return { message: 'Login realizado com sucesso' };
  }
}
