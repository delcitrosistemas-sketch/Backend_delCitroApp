export class ProfileDto {
  id: number;
  usuario: string;
  rol: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FindUserDto {
  usuario: string;
}
