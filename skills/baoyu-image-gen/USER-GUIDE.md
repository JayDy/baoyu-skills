# baoyu-image-gen 使用手册

AI 图片生成 Skill，支持 OpenRouter、Google Gemini、OpenAI、DashScope（通义万象）和 Replicate 五种 API 提供商。安装到 Pocket 后，对话中说"帮我生成一张图片"即可使用。

---

## 1. 安装 Skill

打开 Pocket，进入 技能 页面，选择本地安装，指向 `baoyu-image-gen` 目录。

安装过程中 Pocket 会自动执行 `npm install` 安装依赖。安装完成后，skill 卡片出现在列表中，卡片上会显示 skill 名称、描述，下方带有齿轮形状的设置按钮。

---

## 2. 配置 API Key

点击 skill 卡片右上角的齿轮按钮，打开设置页面。

设置页面分为三个区域：

### RECOMMENDED（推荐）

OpenRouter API Key — 推荐使用。一个 key 即可访问多种图片生成模型（Gemini、Flux 等），性价比高。输入框下方有 "Get your key" 链接，点击可直接跳转到 OpenRouter 官网获取 key。

### OTHER PROVIDERS（其他提供商）

按需填写，不用的留空即可。每个输入框下方都有对应的官网获取链接：

  - Google / Gemini API Key — 获取地址：aistudio.google.com/apikey
  - OpenAI API Key         — 获取地址：platform.openai.com/api-keys
  - DashScope API Key      — 获取地址：dashscope.console.aliyun.com/apikey（阿里云通义万象）
  - Replicate API Token    — 获取地址：replicate.com/account/api-tokens

### DEFAULT PROVIDER（默认提供商）

下拉选择默认使用哪个提供商。选 "Auto-detect (from available keys)" 则自动根据已填写的 key 选择。

填写完成后点击 Save 按钮保存。页面会短暂显示 "Saved!" 确认。

---

## 3. 生成图片

在 Pocket 对话框中直接用自然语言描述你想要的图片即可。Pocket 会自动识别已安装的 baoyu-image-gen skill 并调用。

示例 prompt：

  帮我画一只橘猫坐在窗台上晒太阳，温暖的色调

Pocket 的 AI agent 会：
  1. 识别到已安装的 baoyu-image-gen skill
  2. 读取 skill 文档了解用法
  3. 调用脚本生成图片（调用过程中会显示工具调用详情）
  4. 将生成的图片保存到指定路径并展示在对话中

生成过程通常需要 10~30 秒，取决于所用的模型和图片复杂度。

---

## 4. 进阶用法

### 指定提供商

  用 OpenAI 帮我生成一张日落风景图

### 指定宽高比

  生成一张 16:9 的横版壁纸，内容是雪山湖泊

### 批量生成

  帮我生成 4 张不同风格的猫咪头像

### 参考图片编辑

  参考这张图片，把背景改成蓝色天空
  （在对话中附上参考图片）

注：参考图编辑仅 Google Gemini 和 OpenAI 支持。

### 指定模型

  使用 google/gemini-3-pro-image-preview 模型生成一张风景图

---

## 5. 支持的提供商和默认模型

  提供商                默认模型                                 特点
  ─────────────────────────────────────────────────────────────────────────────
  OpenRouter（推荐）    google/gemini-3.1-flash-image-preview    一个 key 多种模型
  Google / Gemini       gemini-3-pro-image-preview               高质量，支持参考图
  OpenAI                gpt-image-1.5                            支持参考图编辑
  DashScope             z-image-turbo                            中文 prompt 友好
  Replicate             google/nano-banana-pro                   社区模型丰富

自动选择优先级（配置了多个 key 时）：
Google > OpenAI > DashScope > Replicate > OpenRouter

如需固定使用某个提供商，在设置页面的 Default Provider 中选择即可。

---

## 6. 常见问题

Q: 提示 "No API key found"
A: 至少需要配置一个提供商的 API key。点击 skill 设置按钮，填写任意一个 key 后保存。

Q: 只填了 OpenRouter key，但没有自动使用
A: 确认保存成功。如果同时配了多个 key，Auto-detect 会优先选择 Google。可以在 Default Provider 下拉框中手动选择 OpenRouter。

Q: 生成失败，重试后仍然不行
A: 检查 API key 是否有效、账户是否有余额。OpenRouter 可在 openrouter.ai/activity 查看调用记录和错误详情。

Q: 如何更换生成模型
A: 在对话中直接指定，例如"用 google/gemini-3-pro-image-preview 模型生成一张图"。也可以通过 EXTEND.md 配置文件设置默认模型。

Q: 图片质量不够好
A: 默认使用 2K 质量。可以在 prompt 中要求更高质量，或指定更强的模型（如 Gemini Pro）。
