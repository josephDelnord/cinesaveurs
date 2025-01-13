
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";



interface CustomJwtPayload extends JwtPayload {

  userId: string;

}

export const decodeToken = (token: string): CustomJwtPayload | null => {

  try {

    return jwtDecode<CustomJwtPayload>(token);

  } catch (error) {

    console.error("Erreur lors du décodage du token", error);

    return null;

  }

};