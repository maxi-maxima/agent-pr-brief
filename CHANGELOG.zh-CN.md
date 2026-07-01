# 变更记录

## 0.3.0

- 新增 `--fail-on never|review|block`，方便在 CI 中使用 assessment gate。
- 保持报告生成不变；当 assessment 达到所选风险阈值时，命令会返回退出码 `1`。
- 刷新 GitHub Actions pin，避免旧运行时弃用提示。

## 0.2.0

- 新增确定性的 `assessment` 输出，方便 CI 和 PR 评论工作流使用。
- 根据 diff 风险把简报分类为 `pass`、`review` 或 `block`。
- 在 Markdown 和 CLI 摘要中渲染 assessment 状态和原因。

## 0.1.0

- 首个公开版本。
- 解析 unified git diff。
- 用确定性规则评估文件级审查风险。
- 生成 JSON 和 Markdown 审查简报。
- 提供 `from-diff`、`from-git` 和 `demo` 命令。
