import "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    oauthState?: string;
    user?: {
      puuid: string;
      optedIn: boolean;
      gameName?: string;
      tagLine?: string;
    };
  }
}
