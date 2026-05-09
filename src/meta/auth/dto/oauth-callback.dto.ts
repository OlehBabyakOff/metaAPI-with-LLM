export class OAuthCallbackDTO {
  code!: string;
  state!: string;
}

export class OAuthInitResponseDTO {
  url!: string;
  state!: string;
}

export class TokenResponseDTO {
  accessToken!: string;
  tokenType!: string;
}
