import { SetMetadata } from '@nestjs/common';

export const ApiKey = () => SetMetadata('apiKey', true);
