export class ProfileDto {
  id: number;
  usuario: string;
  rol: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FindUserDto {
  usuario: string;
}
