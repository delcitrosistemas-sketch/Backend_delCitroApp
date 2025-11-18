import { IsString, IsOptional, IsDate, IsEnum, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RESPUESTA_FORMULARIOS } from '.prisma/client';

// DTOs para las revisiones (sin registro_salida_id)
class RevisionDocumentacionDto {
  @IsEnum(RESPUESTA_FORMULARIOS)
  boleta_bascula: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  manifiesto_carga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_analisis: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_lavado: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_inspeccion: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_fumigacion: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_ult_carga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_orden_carga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  carga_porte: RESPUESTA_FORMULARIOS;
}

class RevisionTransporteDto {
  @IsEnum(RESPUESTA_FORMULARIOS)
  corresponde_placas_num_unidad: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  corresponde_placas_num_termo_pipa: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  sin_perforaciones_caja_tanque: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  condicion_paredes: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  gatas_correas: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  libre_insectos: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  libre_olores: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  libre_contaminacion: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  condicion_piso: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  residuos_carga_ant: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  fuga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  sellos_escotilla_val_puerta: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  difusor_termo: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  temp_int_termo: RESPUESTA_FORMULARIOS;
}

// DTO principal actualizado
// DTO principal actualizado
class CreateRegistroSalidaTransporteDto {
  @IsString()
  id_proceso: string;

  @IsString()
  num_placas_unidad: string;

  @IsString()
  num_placas_pipa: string;

  @IsString()
  linea_transporte: string;

  @IsString()
  firma_chofer: string;

  @IsString()
  nombre_chofer: string;

  @IsString()
  nombre_realizo: string;

  @IsString()
  firma_realizo: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_entrada?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_salida?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_realizo?: Date;

  // Hacer las revisiones opcionales para evitar problemas
  @ValidateNested()
  @Type(() => RevisionDocumentacionDto)
  @IsOptional()
  revision_documentacion?: RevisionDocumentacionDto;

  @ValidateNested()
  @Type(() => RevisionTransporteDto)
  @IsOptional()
  revision_transporte?: RevisionTransporteDto;
}

class UpdateRegistroSalidaTransporteDto {
  @IsString()
  @IsOptional()
  num_placas_unidad?: string;

  @IsString()
  @IsOptional()
  num_placas_pipa?: string;

  @IsString()
  @IsOptional()
  linea_transporte?: string;

  @IsString()
  @IsOptional()
  firma_chofer?: string;

  @IsString()
  @IsOptional()
  nombre_chofer?: string;

  @IsString()
  @IsOptional()
  nombre_realizo?: string;

  @IsString()
  @IsOptional()
  firma_realizo?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_entrada?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_salida?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_realizo?: Date;

  @ValidateNested()
  @Type(() => RevisionDocumentacionDto)
  @IsOptional()
  revision_documentacion?: RevisionDocumentacionDto;

  @ValidateNested()
  @Type(() => RevisionTransporteDto)
  @IsOptional()
  revision_transporte?: RevisionTransporteDto;
}

// Mantener los DTOs individuales por si los necesitas para otros usos
class CreateRevisionDocumentacionDto {
  @IsInt()
  registro_salida_id: number;

  @IsEnum(RESPUESTA_FORMULARIOS)
  boleta_bascula: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  manifiesto_carga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_analisis: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_lavado: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_inspeccion: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_fumigacion: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_ult_carga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  certificado_orden_carga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  carga_porte: RESPUESTA_FORMULARIOS;
}

class CreateRevisionTransporteDto {
  @IsInt()
  registro_salida_id: number;

  @IsEnum(RESPUESTA_FORMULARIOS)
  corresponde_placas_num_unidad: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  corresponde_placas_num_termo_pipa: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  sin_perforaciones_caja_tanque: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  condicion_paredes: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  gatas_correas: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  libre_insectos: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  libre_olores: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  libre_contaminacion: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  condicion_piso: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  residuos_carga_ant: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  fuga: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  sellos_escotilla_val_puerta: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  difusor_termo: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  temp_int_termo: RESPUESTA_FORMULARIOS;
}

class UpdateRevisionDocumentacionDto {
  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  boleta_bascula?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  manifiesto_carga?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  certificado_analisis?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  certificado_lavado?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  certificado_inspeccion?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  certificado_fumigacion?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  certificado_ult_carga?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  certificado_orden_carga?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  carga_porte?: RESPUESTA_FORMULARIOS;
}

class UpdateRevisionTransporteDto {
  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  corresponde_placas_num_unidad?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  corresponde_placas_num_termo_pipa?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  sin_perforaciones_caja_tanque?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  condicion_paredes?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  gatas_correas?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  libre_insectos?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  libre_olores?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  libre_contaminacion?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  condicion_piso?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  residuos_carga_ant?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  fuga?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  sellos_escotilla_val_puerta?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  difusor_termo?: RESPUESTA_FORMULARIOS;

  @IsEnum(RESPUESTA_FORMULARIOS)
  @IsOptional()
  temp_int_termo?: RESPUESTA_FORMULARIOS;
}

export {
  CreateRegistroSalidaTransporteDto,
  UpdateRegistroSalidaTransporteDto,
  CreateRevisionDocumentacionDto,
  UpdateRevisionDocumentacionDto,
  CreateRevisionTransporteDto,
  UpdateRevisionTransporteDto,
  RevisionDocumentacionDto,
  RevisionTransporteDto,
};
