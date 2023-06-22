import {
  Controller,
  HttpCode,
  HttpStatus,
  Header,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { LoginUserRequest, LoginUserResponse } from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Header('Content-type', 'application/json')
  login(@Request() req) {
    return { user: req.user, msg: 'Logged in' };
  }

  @Get('/login-check')
  @UseGuards(AuthenticatedGuard)
  @Header('Content-type', 'application/json')
  loginCheck(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'session has ended' };
  }
}
