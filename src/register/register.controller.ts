import { Body, Controller, Post, HttpException, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() createRegistrationDto: CreateRegistrationDto) {
    try {
      const registration = await this.registerService.createRegistrationWithPayment(createRegistrationDto);
      return {
        success: true,
        message: 'Registration successful!',
        data: registration,
      };
    } catch (error) {
       console.error(error)
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Registration failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

    @Get(':id')
  async getRegistrationById(@Param('id') id: string) {
    try {
      const registration = await this.registerService.getRegistrationById(id);
      return {
        success: true,
        data: registration,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Registration not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

@Get()
async getAllRegistrations(
  @Query('page') page = '1',
  @Query('limit') limit = '10',
  @Query('isActive') isActive?: string
) {
  try {
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined
    const registrations = await this.registerService.findAll(page, limit, activeFilter)
    return {
      success: true,
      ...registrations, 
    }
  } catch (error) {
    throw new HttpException(
      {
        success: false,
        message: error.message || 'Failed to fetch registrations',
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}


@Get('send-mail/:id')
  async sendMembershipMail(@Param('id') id: string) {
    const registration = await this.registerService.getRegistrationById(id);

    if (!registration.isActive) {
      return { success: false, message: 'Registration is not active yet.' };
    }

    try {
      await this.registerService.sendMembershipEmail(registration.id);
      return { success: true, message: 'Membership email sent.' };
    } catch (err) {
      console.error('Mail send failed:', err);
      return { success: false, message: 'Failed to send membership email.' };
    }
  }
}
