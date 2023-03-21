import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The message to send',
    type: String,
  })
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'The username of the sender',
    type: String,
  })
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    description: 'The username of the receiver',
    type: String,
  })
  @IsNotEmpty()
  receiver: string;
}

export class UpdateChatDto {
  @ApiProperty({
    description: 'The message to send',
    type: String,
  })
  @IsNotEmpty()
  message: string;
}
