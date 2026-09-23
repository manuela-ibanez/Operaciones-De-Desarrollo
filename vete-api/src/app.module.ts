import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [UsuariosModule, MascotasModule, TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true',
      ssl: process.env.DB_SSL === 'true' ?
      { rejectUnauthorized: false } : false,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}