export interface UsuarioLogIn {
  usuario: string;
  password: string;
}

export interface UsuarioRegistro {
  usuario: string;
  role: 'USER';
  password: string;
  phone: string;
}
