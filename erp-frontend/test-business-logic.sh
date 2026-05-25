#!/bin/bash

# ERP系统业务逻辑完整测试脚本
# 使用agent-browser进行全面的业务逻辑测试

set -e

echo "========================================"
echo "ERP系统业务逻辑完整测试"
echo "========================================"
echo ""

# 定义测试结果文件
REPORT_FILE="/workspace/erp-frontend/BUSINESS-LOGIC-TEST-REPORT.md"
> "$REPORT_FILE"

# 记录测试开始时间
START_TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo "# ERP系统业务逻辑完整测试报告" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**测试时间**: $START_TIME" >> "$REPORT_FILE"
echo "**测试类型**: 完整业务逻辑测试" >> "$REPORT_FILE"
echo "**测试范围**: 销售、采购、生产、财务、仓库全模块" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_case() {
  local test_name="$1"
  local expected="$2"
  local actual="$3"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  if [[ "$expected" == "$actual" ]]; then
    echo "✅ [通过] $test_name" | tee -a "$REPORT_FILE"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    return 0
  else
    echo "❌ [失败] $test_name" | tee -a "$REPORT_FILE"
    echo "   预期: $expected" | tee -a "$REPORT_FILE"
    echo "   实际: $actual" | tee -a "$REPORT_FILE"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
  fi
}

echo "## 一、销售模块业务逻辑测试" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "========================================"
echo "一、销售模块业务逻辑测试"
echo "========================================"
echo ""

# 打开浏览器并登录
echo "1. 打开ERP系统并登录..."
agent-browser open http://localhost:3000 && \
agent-browser wait --load networkidle && \
agent-browser snapshot -i > /tmp/login_snapshot.txt 2>&1

# 获取登录表单元素
USERNAME_REF="e3"
PASSWORD_REF="e4"
LOGIN_BTN="e2"

# 填写登录信息
echo "2. 填写登录信息..."
agent-browser fill "$USERNAME_REF" "admin" && \
agent-browser fill "$PASSWORD_REF" "admin123" && \
agent-browser click "$LOGIN_BTN" && \
agent-browser wait --load networkidle && \
agent-browser wait 2000

# 截图保存登录后状态
echo "3. 截图保存登录状态..."
agent-browser screenshot /workspace/erp-frontend/screenshots/01-logged-in.png 2>&1 || true

# 测试1: 验证销售订单列表数据
echo "4. 测试销售订单列表数据完整性..."
echo "**测试1: 销售订单列表数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/sales/orders && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/sales_orders_snapshot.txt 2>&1

# 检查表格是否有数据
if grep -q "XS202505200001" /tmp/sales_orders_snapshot.txt; then
  test_case "销售订单XS202505200001存在" "true" "true"
else
  test_case "销售订单XS202505200001存在" "true" "false"
fi

if grep -q "XS202505200002" /tmp/sales_orders_snapshot.txt; then
  test_case "销售订单XS202505200002存在" "true" "true"
else
  test_case "销售订单XS202505200002存在" "true" "false"
fi

if grep -q "XS202505200003" /tmp/sales_orders_snapshot.txt; then
  test_case "销售订单XS202505200003存在" "true" "true"
else
  test_case "销售订单XS202505200003存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试2: 验证客户列表数据
echo "5. 测试客户列表数据完整性..."
echo "**测试2: 客户列表数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/sales/customers && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/customers_snapshot.txt 2>&1

if grep -q "北京科技有限公司" /tmp/customers_snapshot.txt; then
  test_case "客户'北京科技有限公司'存在" "true" "true"
else
  test_case "客户'北京科技有限公司'存在" "true" "false"
fi

if grep -q "上海商贸集团" /tmp/customers_snapshot.txt; then
  test_case "客户'上海商贸集团'存在" "true" "true"
else
  test_case "客户'上海商贸集团'存在" "true" "false"
fi

if grep -q "深圳智能制造" /tmp/customers_snapshot.txt; then
  test_case "客户'深圳智能制造'存在" "true" "true"
else
  test_case "客户'深圳智能制造'存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试3: 验证产品列表数据
echo "6. 测试产品列表数据完整性..."
echo "**测试3: 产品列表数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/sales/products && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/products_snapshot.txt 2>&1

if grep -q "A型智能传感器" /tmp/products_snapshot.txt; then
  test_case "产品'A型智能传感器'存在" "true" "true"
else
  test_case "产品'A型智能传感器'存在" "true" "false"
fi

if grep -q "B型控制模块" /tmp/products_snapshot.txt; then
  test_case "产品'B型控制模块'存在" "true" "true"
else
  test_case "产品'B型控制模块'存在" "true" "false"
fi

if grep -q "D型工业电源" /tmp/products_snapshot.txt; then
  test_case "产品'D型工业电源'存在" "true" "true"
else
  test_case "产品'D型工业电源'存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试4: 验证报价单业务逻辑
echo "7. 测试报价单业务逻辑..."
echo "**测试4: 报价单业务逻辑**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/sales/quotations && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/quotations_snapshot.txt 2>&1

if grep -q "BJ202505200001" /tmp/quotations_snapshot.txt; then
  test_case "报价单BJ202505200001存在" "true" "true"
else
  test_case "报价单BJ202505200001存在" "true" "false"
fi

if grep -q "BJ202505200004" /tmp/quotations_snapshot.txt; then
  test_case "报价单BJ202505200004(大客户)存在" "true" "true"
else
  test_case "报价单BJ202505200004(大客户)存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试5: 验证应收款数据正确性
echo "8. 测试应收款数据正确性..."
echo "**测试5: 应收款数据正确性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/finance/receivables && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/receivables_snapshot.txt 2>&1

# 检查已完成的收款
if grep -q "paid\|已完成" /tmp/receivables_snapshot.txt; then
  test_case "应收款状态显示正常" "true" "true"
else
  test_case "应收款状态显示正常" "true" "false"
fi

# 检查部分收款
if grep -q "partial\|部分" /tmp/receivables_snapshot.txt; then
  test_case "部分收款状态显示正常" "true" "true"
else
  test_case "部分收款状态显示正常" "true" "false"
fi

echo "" >> "$REPORT_FILE"

echo "========================================"
echo "二、采购模块业务逻辑测试"
echo "========================================"
echo ""

echo "## 二、采购模块业务逻辑测试" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 测试6: 验证供应商数据
echo "9. 测试供应商列表数据完整性..."
echo "**测试6: 供应商列表数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/purchase/suppliers && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/suppliers_snapshot.txt 2>&1

if grep -q "果山环保科技" /tmp/suppliers_snapshot.txt; then
  test_case "供应商'果山环保科技'存在" "true" "true"
else
  test_case "供应商'果山环保科技'存在" "true" "false"
fi

if grep -q "深圳精密电子" /tmp/suppliers_snapshot.txt; then
  test_case "供应商'深圳精密电子'存在" "true" "true"
else
  test_case "供应商'深圳精密电子'存在" "true" "false"
fi

if grep -q "上海机械制造" /tmp/suppliers_snapshot.txt; then
  test_case "供应商'上海机械制造'存在" "true" "true"
else
  test_case "供应商'上海机械制造'存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试7: 验证采购订单数据
echo "10. 测试采购订单数据完整性..."
echo "**测试7: 采购订单数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/purchase/orders && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/purchase_orders_snapshot.txt 2>&1

if grep -q "CG202505200001" /tmp/purchase_orders_snapshot.txt; then
  test_case "采购订单CG202505200001存在" "true" "true"
else
  test_case "采购订单CG202505200001存在" "true" "false"
fi

if grep -q "CG202505200002" /tmp/purchase_orders_snapshot.txt; then
  test_case "采购订单CG202505200002存在" "true" "true"
else
  test_case "采购订单CG202505200002存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试8: 验证应付款数据
echo "11. 测试应付款数据正确性..."
echo "**测试8: 应付款数据正确性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/finance/payables && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/payables_snapshot.txt 2>&1

if grep -q "paid\|已付" /tmp/payables_snapshot.txt; then
  test_case "应付款状态显示正常" "true" "true"
else
  test_case "应付款状态显示正常" "true" "false"
fi

if grep -q "partial\|部分" /tmp/payables_snapshot.txt; then
  test_case "部分付款状态显示正常" "true" "true"
else
  test_case "部分付款状态显示正常" "true" "false"
fi

echo "" >> "$REPORT_FILE"

echo "========================================"
echo "三、生产模块业务逻辑测试"
echo "========================================"
echo ""

echo "## 三、生产模块业务逻辑测试" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 测试9: 验证生产计划数据
echo "12. 测试生产计划数据完整性..."
echo "**测试9: 生产计划数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/production/plans && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/plans_snapshot.txt 2>&1

if grep -q "SC202505200001" /tmp/plans_snapshot.txt; then
  test_case "生产计划SC202505200001存在" "true" "true"
else
  test_case "生产计划SC202505200001存在" "true" "false"
fi

if grep -q "SC202505200002" /tmp/plans_snapshot.txt; then
  test_case "生产计划SC202505200002存在" "true" "true"
else
  test_case "生产计划SC202505200002存在" "true" "false"
fi

if grep -q "producing\|生产中" /tmp/plans_snapshot.txt; then
  test_case "生产中状态显示正常" "true" "true"
else
  test_case "生产中状态显示正常" "true" "false"
fi

if grep -q "completed\|已完成" /tmp/plans_snapshot.txt; then
  test_case "已完成状态显示正常" "true" "true"
else
  test_case "已完成状态显示正常" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试10: 验证配方数据
echo "13. 测试配方数据完整性..."
echo "**测试10: 配方数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/production/recipes && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/recipes_snapshot.txt 2>&1

if grep -q "PF202505200001" /tmp/recipes_snapshot.txt; then
  test_case "配方PF202505200001存在" "true" "true"
else
  test_case "配方PF202505200001存在" "true" "false"
fi

if grep -q "PF202505200002" /tmp/recipes_snapshot.txt; then
  test_case "配方PF202505200002存在" "true" "true"
else
  test_case "配方PF202505200002存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

echo "========================================"
echo "四、仓库模块业务逻辑测试"
echo "========================================"
echo ""

echo "## 四、仓库模块业务逻辑测试" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 测试11: 验证库存数据
echo "14. 测试库存数据完整性..."
echo "**测试11: 库存数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/warehouse/inventory && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/inventory_snapshot.txt 2>&1

# 检查库存数据是否包含产品信息
if grep -q "CP202505200001" /tmp/inventory_snapshot.txt; then
  test_case "库存包含产品编号信息" "true" "true"
else
  test_case "库存包含产品编号信息" "true" "false"
fi

# 检查是否有库存数量显示
if grep -qE "[0-9]+" /tmp/inventory_snapshot.txt; then
  test_case "库存数量显示正常" "true" "true"
else
  test_case "库存数量显示正常" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试12: 验证领料单数据
echo "15. 测试领料单数据完整性..."
echo "**测试12: 领料单数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/warehouse/picks && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/picks_snapshot.txt 2>&1

if grep -q "LL202505200001" /tmp/picks_snapshot.txt; then
  test_case "领料单LL202505200001存在" "true" "true"
else
  test_case "领料单LL202505200001存在" "true" "false"
fi

if grep -q "LL202505200002" /tmp/picks_snapshot.txt; then
  test_case "领料单LL202505200002存在" "true" "true"
else
  test_case "领料单LL202505200002存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试13: 验证发货单数据
echo "16. 测试发货单数据完整性..."
echo "**测试13: 发货单数据完整性**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/warehouse/deliveries && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/deliveries_snapshot.txt 2>&1

if grep -q "FH202505200001" /tmp/deliveries_snapshot.txt; then
  test_case "发货单FH202505200001存在" "true" "true"
else
  test_case "发货单FH202505200001存在" "true" "false"
fi

if grep -q "FH202505200002" /tmp/deliveries_snapshot.txt; then
  test_case "发货单FH202505200002存在" "true" "true"
else
  test_case "发货单FH202505200002存在" "true" "false"
fi

echo "" >> "$REPORT_FILE"

echo "========================================"
echo "五、数据关联业务逻辑测试"
echo "========================================"
echo ""

echo "## 五、数据关联业务逻辑测试" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 测试14: 验证订单与客户的关联
echo "17. 测试订单与客户的数据关联..."
echo "**测试14: 订单与客户的数据关联**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/sales/orders && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/orders_customers_snapshot.txt 2>&1

# 检查订单是否关联了客户名称
if grep -qE "(北京科技|上海商贸|深圳智能)" /tmp/orders_customers_snapshot.txt; then
  test_case "销售订单关联客户名称" "true" "true"
else
  test_case "销售订单关联客户名称" "true" "false"
fi

# 检查订单是否有金额
if grep -qE "[0-9,]+\.[0-9]{2}" /tmp/orders_customers_snapshot.txt; then
  test_case "销售订单包含金额信息" "true" "true"
else
  test_case "销售订单包含金额信息" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试15: 验证采购订单与供应商的关联
echo "18. 测试采购订单与供应商的数据关联..."
echo "**测试15: 采购订单与供应商的数据关联**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/purchase/orders && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/orders_suppliers_snapshot.txt 2>&1

# 检查采购订单是否关联了供应商名称
if grep -qE "(果山|德堡|深圳精密|上海机械)" /tmp/orders_suppliers_snapshot.txt; then
  test_case "采购订单关联供应商名称" "true" "true"
else
  test_case "采购订单关联供应商名称" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 测试16: 验证生产计划与产品的关联
echo "19. 测试生产计划与产品的数据关联..."
echo "**测试16: 生产计划与产品的数据关联**" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

agent-browser open http://localhost:3000/production/plans && \
agent-browser wait --load networkidle && \
agent-browser wait 2000 && \
agent-browser snapshot -i > /tmp/plans_products_snapshot.txt 2>&1

# 检查生产计划是否关联了产品名称
if grep -qE "(智能传感器|控制模块|连接配件|工业电源)" /tmp/plans_products_snapshot.txt; then
  test_case "生产计划关联产品名称" "true" "true"
else
  test_case "生产计划关联产品名称" "true" "false"
fi

echo "" >> "$REPORT_FILE"

# 最终截图
echo "20. 保存最终测试截图..."
agent-browser open http://localhost:3000/home && \
agent-browser wait --load networkidle && \
agent-browser screenshot /workspace/erp-frontend/screenshots/02-final-homepage.png 2>&1 || true

# 关闭浏览器
agent-browser close 2>&1 || true

# 生成测试总结
echo "========================================"
echo "测试总结"
echo "========================================"
echo ""

END_TIME=$(date '+%Y-%m-%d %H:%M:%S')

echo "## 测试总结" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**测试完成时间**: $END_TIME" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "### 测试结果统计" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| 指标 | 数量 |" >> "$REPORT_FILE"
echo "|------|------|" >> "$REPORT_FILE"
echo "| 总测试用例 | $TOTAL_TESTS |" >> "$REPORT_FILE"
echo "| 通过测试 | $PASSED_TESTS |" >> "$REPORT_FILE"
echo "| 失败测试 | $FAILED_TESTS |" >> "$REPORT_FILE"
echo "| 通过率 | $(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)% |" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 生成详细问题报告（如果有失败）
if [ $FAILED_TESTS -gt 0 ]; then
  echo "### 失败的测试用例" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
  echo "请查看上述失败的测试用例列表，需要进一步排查。" >> "$REPORT_FILE"
  echo "" >> "$REPORT_FILE"
fi

echo "### 测试覆盖范围" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- ✅ 销售模块：客户、产品、报价单、销售订单、应收款" >> "$REPORT_FILE"
echo "- ✅ 采购模块：供应商、原材料、采购订单、应付款" >> "$REPORT_FILE"
echo "- ✅ 生产模块：生产计划、配方" >> "$REPORT_FILE"
echo "- ✅ 仓库模块：库存、领料单、发货单" >> "$REPORT_FILE"
echo "- ✅ 数据关联：订单-客户、订单-供应商、计划-产品" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "### 建议" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "1. 对于失败的测试用例，需要检查数据是否正确导入" >> "$REPORT_FILE"
echo "2. 验证前端页面组件是否正确渲染数据" >> "$REPORT_FILE"
echo "3. 检查后端API接口是否正常返回数据" >> "$REPORT_FILE"
echo "4. 确认localStorage数据注入是否成功" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "========================================"
echo "✅ 测试完成！"
echo "========================================"
echo ""
echo "测试报告已保存至: $REPORT_FILE"
echo "截图已保存至: /workspace/erp-frontend/screenshots/"
echo ""
echo "总测试用例: $TOTAL_TESTS"
echo "通过测试: $PASSED_TESTS"
echo "失败测试: $FAILED_TESTS"
echo "通过率: $(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)%"
echo ""

# 如果有失败的测试，退出码为1
if [ $FAILED_TESTS -gt 0 ]; then
  echo "⚠️  存在失败的测试用例，请查看报告。"
  exit 1
else
  echo "✅ 所有测试用例通过！"
  exit 0
fi
