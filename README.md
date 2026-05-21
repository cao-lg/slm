# ERP企业管理系统

基于 Vue 3 + Spring Boot + MySQL 的ERP企业管理系统复刻项目。

## 技术栈

### 后端
- Spring Boot 3.2
- Spring Security + JWT
- MyBatis Plus
- MySQL 8.0
- Redis

### 前端
- Vue 3
- TypeScript
- Vue Router 4
- Pinia
- Element Plus
- Vite

## 功能模块

- 销售管理：客户管理、报价单、销售订单
- 采购管理：供应商管理、采购订单
- 生产管理：生产计划
- 仓库管理：库存管理
- 产品管理：产品列表
- 财务管理：应收管理、应付管理、报销管理
- 系统管理：用户管理、站内通知

## 快速开始

### 环境要求
- JDK 17+
- Node.js 18+
- MySQL 8.0+
- Docker (可选)

### Docker部署（推荐）

```bash
cd /workspace
docker-compose up -d
```

访问 http://localhost

### 本地开发

#### 后端
```bash
cd erp-backend
./mvnw spring-boot:run
```

#### 前端
```bash
cd erp-frontend
npm install
npm run dev
```

## 默认账号

- 用户名：CLG
- 密码：258258258

## 项目结构

```
erp-backend/        # 后端项目
erp-frontend/       # 前端项目
docker-compose.yml  # Docker部署配置
```

## 文档

详细需求规格说明请参考：
- [规格说明书](./.trae/specs/erp-system-replication/spec.md)
- [任务清单](./.trae/specs/erp-system-replication/tasks.md)
- [检查清单](./.trae/specs/erp-system-replication/checklist.md)
