import request from '@/utils/request'

export interface LoginDTO {
  username: string
  password: string
}

export interface LoginVO {
  token: string
  userInfo: {
    userId: number
    username: string
    realName: string
    role: string
    department?: string
    email?: string
    phone?: string
  }
}

export const login = (data: LoginDTO) => {
  return request.post<any, { data: LoginVO }>('/auth/login', data)
}

export const getUserInfo = () => {
  return request.get<any, { data: LoginVO['userInfo'] }>('/auth/userinfo')
}

export const logout = () => {
  return request.post('/auth/logout')
}
