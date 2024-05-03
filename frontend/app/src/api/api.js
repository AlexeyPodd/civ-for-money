import server from "./server";

export const loginAPI = {
  async sendAuthData(paramString) {    
    const response = await server.get(`auth/authorize/?${paramString}`);
    return response;
  },
}