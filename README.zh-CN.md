<div align="center">

# Agent PR Brief

**为 AI agent 生成的 Pull Request 生成确定性的审查简报。**

[English](README.md)

</div>

AI 编码 agent 可以在几分钟内生成一个很大、看起来也合理的 PR。这会改变 code review 的问题。现在的问题不只是“代码能不能写出来”，而是“人类 reviewer 应该先看哪里”。

`agent-pr-brief` 会把 git diff 转成一份简洁的审查路线图：

- 高风险文件优先
- 给出机械、可解释的风险原因
- 生成和 diff 相关的 reviewer 问题
- 输出 JSON 和 Markdown，方便 CI 或 PR 评论使用

不需要 API key。不调用 LLM。不做遥测。

## 为什么做这个

模型生成的摘要有用，但不够。它可能漏掉一些无聊但关键的机械事实：

- `package.json` 里新增了 `postinstall`
- auth 代码开始读取新的环境变量
- migration 改了 schema 行为
- workflow 或 deploy 文件变化了
- 一个很大的生成 diff 里藏着一个敏感文件

这些信号都直接存在于 diff 里。reviewer 开始逐行阅读之前，应该先看到它们。

## 30 秒演示

```bash
npx github:maxi-maxima/agent-pr-brief demo
```

演示会写出：

```text
reports/demo/agent.diff
reports/demo/agent-pr-brief.json
reports/demo/agent-pr-brief.md
```

## 使用 diff 文件

```bash
git diff origin/main...HEAD > /tmp/pr.diff
npx github:maxi-maxima/agent-pr-brief from-diff /tmp/pr.diff --title "agent update" --out reports/pr-brief
```

## 在 git 仓库中使用

```bash
npx github:maxi-maxima/agent-pr-brief from-git origin/main --title "agent update" --out reports/pr-brief
```

## 输出示例

```text
Agent PR Brief HIGH
Files: 3
Added: 5
Removed: 1
High risk: 2
Medium risk: 0
Reports: reports/demo
```

Markdown 包含：

- 总体统计
- 排好序的审查顺序
- 文件级风险原因
- reviewer 应该问的问题

## 风险信号

| 信号 | 风险 |
| --- | --- |
| authentication、session、permission、OAuth、JWT、token 路径 | high |
| 环境变量行为变化 | high |
| `postinstall` 等 package 生命周期脚本 | high |
| 命令执行入口 | high |
| 绕过/不安全相关措辞 | high |
| `.env.example` 等环境文件 | medium |
| `Dockerfile`、`docker-compose.yml` 等容器运行时配置 | medium |
| dependency/package 元数据 | medium |
| database/schema 路径 | medium |
| CI/deploy/workflow 路径 | medium |
| 删除文件或非常大的单文件 diff | medium |

## 命令

```bash
agent-pr-brief demo [--out reports/demo]
agent-pr-brief from-diff <file> [--title "agent PR"] [--out reports/agent-pr-brief]
agent-pr-brief from-git [base] [--title "agent PR"] [--out reports/agent-pr-brief]
```

## 它不是什么

这个工具不会批准代码，不替代测试，也不会告诉你 PR 一定正确。它只是在 reviewer 阅读 patch 前，给出一个确定性的起点。

## 开发

```bash
npm install
npm run check
node dist/cli.js demo --out reports/demo
npm pack --dry-run --ignore-scripts
```

## 许可证

MIT
