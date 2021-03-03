import { IsNotEmpty } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  url: string;
}
