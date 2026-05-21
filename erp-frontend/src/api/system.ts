import request from '@/utils/request'

export interface UserManagement {
  id?: number
  userName: string
  realName: string
  password?: string
  role: string
  department?: string
  email?: string
  phone?: string
  status: number
  avatar?: string
  position?: string
  createDate?: string
  updateDate?: string
}

export interface Message {
  messageID?: number
  title: string
  content: string
  messageType: number
  senderID?: number
  senderName?: string
  receiverIDs?: string
  receiverNames?: string
  isAll: number
  isRead?: number
  readDate?: string
  publishDate?: string
  priority: number
  status?: number
  createDate?: string
}

export interface SystemConfig {
  configID?: number
  configKey: string
  configName: string
  configValue: string
  configType: string
  description?: string
  sortOrder?: number
  status?: number
}

export interface OperationLog {
  logID?: number
  module: string
  operationType: string
  operationDesc: string
  operatorID?: number
  operatorName?: string
  requestMethod?: string
  requestUrl?: string
  requestParams?: string
  responseResult?: string
  statusCode?: number
  ipAddress?: string
  userAgent?: string
  executionTime?: number
  isSuccess?: number
  errorMessage?: string
  operateDate?: string
}

export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export const getUserList = (params: PageParams) => {
  return request.get<any, { data: PageResult<UserManagement> }>('/system/user/list', { params })
}

export const getUserDetail = (id: number) => {
  return request.get<any, { data: UserManagement }>('/system/user/detail', { params: { id } })
}

export const addUser = (data: UserManagement) => {
  return request.post('/system/user/add', data)
}

export const updateUser = (data: UserManagement) => {
  return request.put('/system/user/update', data)
}

export const deleteUser = (id: number) => {
  return request.delete('/system/user/delete', { params: { id } })
}

export const updateUserStatus = (id: number, status: number) => {
  return request.put('/system/user/status', null, { params: { id, status } })
}

export const changePassword = (data: { id: number; oldPassword: string; newPassword: string }) => {
  return request.post('/system/user/change-password', data)
}

export const resetPassword = (id: number) => {
  return request.post('/system/user/reset-password', null, { params: { id } })
}

export const getMessageList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Message> }>('/system/message/list', { params })
}

export const getUnreadMessages = (receiverID: number) => {
  return request.get<any, { data: Message[] }>('/system/message/unread', { params: { receiverID } })
}

export const getMessageDetail = (messageID: number) => {
  return request.get<any, { data: Message }>('/system/message/detail', { params: { messageID } })
}

export const publishMessage = (data: Message) => {
  return request.post('/system/message/publish', data)
}

export const markAsRead = (messageID: number, receiverID: number) => {
  return request.post('/system/message/mark-read', null, { params: { messageID, receiverID } })
}

export const markAllAsRead = (receiverID: number) => {
  return request.post('/system/message/mark-all-read', null, { params: { receiverID } })
}

export const deleteMessage = (messageID: number) => {
  return request.delete('/system/message/delete', { params: { messageID } })
}

export const getConfigList = (configType?: string) => {
  return request.get<any, { data: SystemConfig[] }>('/system/config/list', { 
    params: configType ? { configType } : {} 
  })
}

export const getConfigMap = () => {
  return request.get<any, { data: Record<string, string> }>('/system/config/map')
}

export const getConfigValue = (configKey: string) => {
  return request.get<any, { data: string }>('/system/config/value', { params: { configKey } })
}

export const updateConfig = (data: SystemConfig) => {
  return request.put('/system/config/update', data)
}

export const batchUpdateConfigs = (configs: Record<string, string>) => {
  return request.put('/system/config/batch-update', configs)
}

export const deleteConfig = (configID: number) => {
  return request.delete('/system/config/delete', { params: { configID } })
}

export const getLogList = (params: PageParams & { module?: string; startDate?: string; endDate?: string }) => {
  return request.get<any, { data: PageResult<OperationLog> }>('/system/log/list', { params })
}

export const getLogDetail = (logID: number) => {
  return request.get<any, { data: OperationLog }>('/system/log/detail', { params: { logID } })
}

export const getLogStats = () => {
  return request.get<any, { data: { total: number; today: number } }>('/system/log/stats')
}

export const deleteLog = (logID: number) => {
  return request.delete('/system/log/delete', { params: { logID } })
}

export const clearLogs = () => {
  return request.delete('/system/log/clear')
}
