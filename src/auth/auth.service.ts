import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    let passwordValid = false;
    let error = true;

    const usuario = await this.usuarioRepository.findOneBy({
      username: loginDto.username,
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

    const acessToken = await this.jwtService.signAsync(
      {
        sub: usuario.id_usuario
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl
      }
    )

    return {
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      acessToken
    };
  }
}
