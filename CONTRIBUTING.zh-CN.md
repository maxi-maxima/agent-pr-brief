# 贡献指南

感谢你改进 Agent PR Brief。

## 本地开发

```bash
npm install
npm run check
```

## 开发原则

- 保持评分确定性。
- 不在核心分析里加入 LLM 调用。
- 修改风险规则或 Markdown 输出时，请补测试。
- 优先使用简单、可解释的规则，而不是隐藏评分。

## Pull Request

请说明：

- 新增或修改的风险信号
- 示例 diff 输入
- `npm run check` 的验证结果
