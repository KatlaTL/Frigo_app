import { Credentials } from "@contexts/auth.context";
import { AxiosInstance } from "axios";

type AuthSignInResponse = {
    credentials: Credentials;
};

export class AuthService {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    /**
     * Post method to sign in the user using email and password
     * @param email - The user's email
     * @param password - The user's password
     * @returns AuthSignInResponse containing status and credentials
     */
    signIn = async (email: string, password: string): Promise<AuthSignInResponse> => {
        try {
            const signInResponse = await this.axiosInstance.post<AuthSignInResponse>("/auth/sign-in", {
                email,
                password
            });

            return signInResponse.data;
        } catch (err) {
            throw err;
        }
    }

    signOut = async (userId: number, email: string) => {
        try {
            const signOutResponse = await this.axiosInstance.post("/auth/sign-out", {
                userId,
                email
            })
            
            return signOutResponse.data;
        } catch (err) {
            throw err;
        }
    }
}

export const createAuthService = (axiosInstance: AxiosInstance) => new AuthService(axiosInstance);