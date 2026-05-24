export const mockLoginSuccessResponse = {
  data: {
    token: 'mock-jwt-token-123456',
    userInfo: {
      userId: 1,
      username: 'admin',
      realName: '系统管理员',
      role: 'admin',
      department: '技术部',
      email: 'admin@example.com',
      phone: '13800138000'
    }
  }
}

export const mockLoginCredentials = {
  valid: {
    username: 'admin',
    password: 'admin123'
  },
  invalid: {
    username: 'wrong',
    password: 'wrong123'
  }
}

export const mockUserInfo = mockLoginSuccessResponse.data.userInfo
