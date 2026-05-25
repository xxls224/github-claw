# SEO 优化技能

## 目标
为静态或单页网站提供结构化、可执行的 SEO 优化流程，覆盖元数据、结构化数据、可抓取性与内容结构。

## 触发关键词
SEO、搜索引擎优化、sitemap、robots、结构化数据、Open Graph、Twitter Card、可抓取性。

## 输入
- 站点基础 URL（含部署路径）
- 业务定位与核心关键词
- 目标受众与服务地区
- 主要页面结构（单页/多页）

## 输出
- SEO 检查清单与问题列表
- 需要修改的文件与改动建议
- 更新后的元数据与结构化数据方案
- robots.txt 与 sitemap.xml

## 执行流程
1. 站点现状盘点：读取 index.html、public/、主内容组件，确认当前元数据与内容结构。
2. 元数据优化：补齐 title、description、keywords、robots、canonical、Open Graph、Twitter Card，社交分享图建议使用 1200x630 PNG/JPG。
3. 结构化数据：提供 JSON-LD（组织/服务/本地业务等），确保信息准确且不过度承诺。
4. 可抓取性：新增 robots.txt 与 sitemap.xml，校验 URL 与路径一致。
5. 内容结构：确保单一 H1、层级清晰的 H2/H3、CTA 与锚点链接可用。
6. 资产与性能：检查预加载、图片 alt、lazy/async、无阻塞资源。
7. 文档同步：在 README 中补充 SEO 相关配置说明。

## 完成标准
- 站点存在完整的 SEO 元数据与社交分享信息。
- 结构化数据通过语义检查且与页面内容一致。
- robots.txt 与 sitemap.xml 可被搜索引擎抓取。
- README 明确告知如何更新域名、基础路径与 SEO 文件。

## 适用范围
- Vite/React 静态站点或单页站点
- GitHub Pages 或同类静态托管平台
