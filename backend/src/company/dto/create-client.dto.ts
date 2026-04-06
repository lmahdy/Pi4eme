import { IsString, IsNotEmpty, IsEmail, IsMongoId, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le nom ne doit pas dépasser 50 caractères' })
  @Matches(/^[a-zA-Z0-9\s\-\']+$/, { message: 'Le nom contient des caractères non autorisés' })
  name: string;

  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
  @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/, { message: 'Format de téléphone invalide' })
  phone: string;

  @IsEmail(undefined, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  @MaxLength(100, { message: 'L\'email ne doit pas dépasser 100 caractères' })
  email: string;

  @IsMongoId({ message: 'ID de société invalide' })
  @IsNotEmpty({ message: 'L\'ID de société est obligatoire' })
  companyId: string;
}
