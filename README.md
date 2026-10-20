# PGM P8 英文展示网站

本项目已按海外客户场景改版：英文文案、深色产品首屏、PGM 原页产品图、四种玩法切换、直屏／曲屏布局、米／英尺尺寸转换、询盘表单和 WhatsApp 浮动入口。现已包含 Products 产品列表页、十个产品详情页和六个补充页面：应用方案、安装指南、关于我们、联系、项目参考和 P8 独立详情。全站共 19 个页面。仍为纯 HTML / CSS / JavaScript，适配 GitHub Pages。

页面现有两段演示视频：首屏数据区后展示挥杆、球路反馈和模拟器空间；设备区展示动态平台坡度、站姿与击球。动感平台详情页也使用第二段视频。两张封面图随网站一起上传，视频仅在访客点击播放时从阿里巴巴视频 CDN 加载。播放失败时会出现直达视频链接。视频文件本身不在压缩包内；若日后原始链接失效，请在 `site.js` 的 `demoVideos`、`index.html` 和 `products/motion-platform.html` 的备用链接中同步更换。

## 当前联系渠道状态

根据你的要求，**收件邮箱和 WhatsApp 号码暂时留空**。
- 询盘按钮目前禁用，访客会看到英文“暂未开放”提示，不会误以为留言已发送。
- WhatsApp 入口保留位置，标注 Coming soon，不会跳到错误号码。
- 填入配置并重新上传后，两个入口自动启用。

## 后续添加邮箱和 WhatsApp

只需编辑 `config.js`：

```js
window.SITE_CONFIG = Object.freeze({
  contactEmail: '填写你的收件邮箱',
  formSubmitToken: '',
  whatsappNumber: '填写带国家区号的完整号码',
  whatsappMessage: "Hi, I'm interested in the PGM P8 golf simulator. Could you help me plan a setup?"
});
```

以上文字为说明，不能作为实际配置直接使用。邮箱和电话号码互不依赖，可分别启用。

### 邮件询盘的工作方式

GitHub Pages 托管静态页面，表单通过 **FormSubmit** 转发到收件邮箱。访客不需要打开自己的邮件软件。

1. 在 `contactEmail` 中填入真实收件邮箱，重新部署网站。
2. 从正式 HTTPS 网址提交一条自己的测试询盘；进入 FormSubmit 页面完成可能出现的验证码。
3. 收件邮箱会收到首次激活邮件，由邮箱所有人点击确认。检查垃圾邮件目录。
4. **激活后再提交一条测试询盘，确认邮箱确实收到**，然后对外启用推广。
5. 如希望表单地址不直接暴露邮箱，可将服务提供的随机标识填入 `formSubmitToken`。这不是 SMTP 密码或密钥；不要在前端填写任何账户密码。配置邮箱时仍会展示邮件联系链接；若要隐藏公开邮箱，可在取得标识后清空 `contactEmail`。

使用原生 POST 提交，保留 FormSubmit 的验证码和实际结果页。我们不在前端伪造“邮件已送达”。表单包括必填校验、空白输入校验、蜜罐字段和隐私说明。没有发送任何测试邮件，也没有连接真实 WhatsApp 账号；真实收件验证待提供邮箱后进行。

服务依赖第三方网络和政策，首次激活及最终收件不能在无收件地址时验证。请从正式网站测试，不要依赖双击 `file://` 的方式测试邮件服务。

官方文档：https://formsubmit.co/documentation

### WhatsApp

在 `whatsappNumber` 填入国际格式完整号码，例如以 `+44`、`+1`、`+86` 开头。程序会移除空格、括号、横线和加号，生成 `https://wa.me/国家区号及号码?text=...`。不能保留本地拨号时的前导零。号码必须实际开通 WhatsApp。

点击后进入 WhatsApp 并带入英文预设消息，**不会自动发送**。客户自行确认发送。网站同时有悬浮按钮和表单旁的联系入口。

## 免费部署 GitHub Pages

1. 创建公开 GitHub 仓库，例如 `pgm-p8`。
2. 解压项目，将 `greenroom-golf` 文件夹里的全部网站文件上传至仓库根目录，包括 `index.html`、`products.html`、`privacy.html`、全部 CSS 和 JS 文件、整个 `products/` 和 `assets/` 文件夹。保留 `.nojekyll`。仓库根目录应直接包含 `index.html`，不要再嵌套一层 `greenroom-golf`。
3. Settings → Pages → Source 选择 **Deploy from a branch**。
4. 选择 `main` 和 `/(root)`，保存并等待部署成功。
5. 从 Pages 设置页打开实际网址，通常是 `https://用户名.github.io/pgm-p8/`。

不需要安装 npm、不需要构建、不需要付费服务器。全部图片本地保存，使用相对路径兼容 GitHub 仓库子目录。

可选 `.github/workflows/pages.yml`：若使用该工作流，则将 Pages 的 Source 改为 **GitHub Actions**，完整提交隐藏目录，在 `main` 上推送或手动运行工作流。两种部署方式二选一。

GitHub 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 文件与修改位置

| 文件 | 用途 |
| --- | --- |
| `index.html` | 英文页面、导航、技术介绍、设备介绍、FAQ、表单 |
| `products.html` | Products 产品列表：P8 整套展示和六个配件类别、两款快拼舱和两款空间舱 |
| `products/impact-screen.html` | MNQ010 幕布详情 |
| `products/ball-return.html` | MNQHQJ002 回球机详情 |
| `products/motion-platform.html` | DGPT001 八向平台详情及演示视频 |
| `products/mirror-console.html` | MNQKZT002 定制镜面触控台详情 |
| `products/hitting-mats.html` | DJD039 / DJD036 / DJD055 三个打击垫型号 |
| `styles.css` | 桌面／手机样式、字体和颜色 |
| `catalog.css` | 产品列表及详情页的桌面／手机样式 |
| `app.js` | 首页玩法与布局切换、尺寸转换 |
| `enquiry.js` | 首页／联系页共用询盘流程及产品、型号、用途、布局预选 |
| `pages.js` | 公司资料显示与安装指南米／英尺换算 |
| `pages.css` | 补充页面、统一导航与页脚、桌面／手机样式 |
| `site.js` | 跨页面手机导航、视频播放及 WhatsApp 配置 |
| `config.js` | 收件邮箱、FormSubmit 标识、WhatsApp 号码与预设消息 |
| `privacy.html` | 英文隐私说明 |
| `assets/` | PGM 素材、视频封面、品牌 LOGO、站点图标及当前适用的产品图片和宣传单 JPG |
| `ASSETS.md` | 素材来源、文案处理与替换指南 |

玩法文字及尺寸数据在 `app.js` 中维护；默认直屏静态内容同时存在 `index.html`，请同步修改。CSS 顶部 `:root` 控制配色。后续补充实际经营主体名称、地址和联系信息时，请同步更新隐私页。

## 内容来源与边界

产品信息来自用户提供的 https://www.pgmgolf.com/PGM_P8_Simulator ，已重新组织为面向欧美客户的英文文案。

- 采用原页的四摄像头、内置 MCU 微型计算机、UE5、4K 投影、八向平台和安装参考尺寸。
- 保留“具体配置以报价为准”，未将 8K 软件能力误写成 8K 投影设备。
- 未复制原页的一小时响应、保修、免费安装等承诺，也未替你使用原页的经销商电话或邮箱。
- 没有加入未经核实的客户评价、销量或认证徽章。
- 页面使用 PGM 产品品牌作为展示主体，不声称本网站为 PGM 官方网站或获授权经销商。
- 图片按你的指示从 PGM 页面复用，具体文件映射见 `ASSETS.md`。

## 发布前检查

- 收件邮箱激活后，实测收到一封询盘邮件。
- WhatsApp 能打开你自己的正确号码。
- 手机导航、英尺切换及两种屏幕方案工作正常。
- 在正式网站上分别播放两段视频，并确认外部视频链接持续可用。
- 核对最终销售配置、服务范围及隐私页经营主体资料。

## 可单独采购的组件

首页设备区之后的英文“Available separately”模块列出幕布、回球机、八向动感平台、定制镜面控制台（附无线键盘鼠标，适用于 2K／4K 配置）和打击垫。每张卡片的“View details”进入对应详情页；顶部导航的“Products”进入产品列表页。详情页的“Request a quote”把产品名称及型号带入独立联系页询盘表单，并将项目类型切换为“Standalone component”。用户改选其他产品时，旧型号会清除，已填写留言保留。该表单仍需按上文填写真实收件邮箱并完成激活后才能发送。单品展示不表示整机报价必然包含该配件。

五张由用户提供的单品图片已加入对应卡片，并随网站一起打包。文件对应关系见 `ASSETS.md`。触控台图片中的显示屏含中文原始画面；如需图片内容也为英文，可日后替换为英文界面实拍图。

## 产品资料与维护

十个详情页均为独立静态 HTML，可直接分享链接，无需额外服务或路由配置。各页提供英文产品说明、已确认规格、安装询问提示、相关产品和询价入口；有适用宣传单的产品另提供原图预览及下载。首屏使用单品 PNG 或优化后的 WEBP，较大的宣传单在展开预览或打开下载时使用。

- MNQ010：双层幕布，支持定制尺寸，宣传单列出最大高度 3 m。
- MNQHQJ002：自动回球系统；宣传单未列尺寸和电源参数，页面标为询价时确认。
- DGPT001：1786 × 1291 × 190 mm、169.5 kg、125 mm / 7°、最大载重 350 kg、230 V / 50 Hz、待机 30 W / 运行 500 W。海外客户应确认当地电源与软件集成。
- MNQKZT002：镜面触控、侧边收纳键盘设计、内置摄像头；随附无线键鼠以及 2K／4K 兼容说明来自用户。2K／4K 不作为控制台屏幕分辨率。
- 打击垫统一一个详情页，包含 DJD039、DJD036、DJD055。已有打击垫 PNG 标为安装示例，各型号照片见原版宣传单。
- DJD055 宣传单主图与细节图的刷毛／草丝高度不同，页面未选择其中一个数值作为最终规格，需报价时确认。长度、长草垫宽度、底层厚度、材料和固定方式按一致信息录入。

资料或价格变动后，请直接编辑对应 HTML；若修改型号，同时更新详情页询价链接和 `enquiry.js` 的 `modelOptions` 白名单。WhatsApp 可用后，配件详情页会自动附带产品名称和型号。暂未填联系方式时，仍显示 Coming soon，不会发送询盘或跳转到示例号码。


## 补充页面（2026-10-05）

| 页面 | 内容 |
| --- | --- |
| `solutions.html` | 家庭、商业、教学应用；单品升级与经销询问入口 |
| `installation.html` | 直屏／曲屏参考尺寸、米／英尺切换、房间示意图和可下载准备清单 |
| `about.html` | 产品范围、选型与房间规划流程；可配置公司资料 |
| `contact.html` | 独立联系页、询价表单、邮箱与 WhatsApp 入口、可配置公司地址 |
| `projects.html` | PGM 厂商安装与布局参考；已交付项目故事暂未开放 |
| `p8-simulator.html` | 独立整机详情、系统特点、演示视频、玩法与配置说明 |

页头和页脚已统一。配件详情页询价按钮进入 `contact.html` 并携带产品和型号；方案页携带用途，安装指南携带布局。首页仍保留原来的询盘表单，共用 `enquiry.js`；旧首页询盘链接继续有效。

公司字段在 `config.js` 填写：`companyName`、`companyDescription`、`companyLocation`、`companyAddress`、`companyHours`。它们当前均为空。填写真实英文资料后 About／Contact 自动显示，未填写的地址和营业时间不会出现。没有编造公司历史、工厂、客户评价、项目国家或安装数量。

项目页使用已有 PGM 别墅照片以及直屏／曲屏布局图，明确标为厂商参考，并不声称由当前销售团队交付。后续有真实实拍与配置资料时，在 `projects.html` 的 Completed Installations 区替换“Coming soon”模块。建议每个案例列出授权实拍、用途、实际房间尺寸、配置和可公开的地点。

`assets/room-planning.svg` 为网页制作的示意图，标注非比例、非具体安装方案；`assets/room-planning-checklist.txt` 为英文准备清单。尺寸换算采用 1 ft = 0.3048 m。清单与图均可随静态网站部署。

GitHub Actions 的准备步骤已包含所有根目录 HTML／CSS／JS 以及 `products/` 和 `assets/`，无需单独构建。上传仓库时请完整上传网站目录内的内容。

## 产品更新（2026-10-06）

新版使用当前名称与型号，不再展示或提供已停用型号的宣传单。保留原网页地址，客户现有收藏链接会进入更新后的产品页面。

| 当前产品 | 型号 | 详情页 |
| --- | --- | --- |
| 双层抗击打幕布 | MNQ010 | products/impact-screen.html |
| 自动回球系统 | MNQHQJ002 | products/ball-return.html |
| 八向动感平台 | DGPT001 | products/motion-platform.html |
| 镜面触控控制台 | MNQKZT002 | products/mirror-console.html |
| 打击垫系列 | DJD039 / DJD036 / DJD055 | products/hitting-mats.html |
| 定制防击打软包 | MNQ014 | products/custom-impact-padding.html |
| 钢架快拼舱 | MKPC001 | products/quick-assembly-enclosure-mkpc001.html |
| 软包快拼舱 | MKPC002 | products/quick-assembly-enclosure-mkpc002.html |
| 模拟器空间舱 | MTKC001 | products/golf-space-capsule-mtkc001.html |
| 圆角模拟器空间舱 | MTKC002 | products/golf-space-capsule-mtkc002.html |

Products 按整机、配件、快拼舱、空间舱组织，所有新型号均有独立询价入口；首页与 Contact 表单同步支持新类别，询价自动带入当前型号。检测器仅作为 P8 整机技术展示，不作为独立销售单品。

首页和 P8 详情页新增四目高速摄像检测器 + 内置 MCU 核心卖点模块，包含多角度采集、独立处理与软件反馈流程。英文“China’s first”采用用户提供及 PGM 产品资料中的国内首创表述，页面注明为 PGM 产品创新主张。未添加未经验证的帧率、延迟或检测精度。主机仍负责运行模拟器软件与球场画面。

触控台按新资料展示 23.5 英寸触屏、镜面、摄像头、侧抽键盘及立体声音响。MTKC001 按资料展示 8 × 3.5 × 3.4 m、28 m²、约 5 吨及整体吊装参考；MTKC002 缺少对应参数，留待报价确认，未借用另一款数据。MKPC001 的约两小时安装为厂商参考估计，取决于现场与人员。国内免费安装、人民币宣传价格和寿命承诺未转成海外服务承诺。

新图片仅进行网页尺寸与编码压缩，保留完整画面；中文标签仍属于提供的原始图片内容。下载的宣传单保持原 JPG。素材映射和校验信息在 assets/product-sources.json。未上传或发布至 GitHub；邮箱及 WhatsApp 仍按你的要求留空。


## 产品图片显示与图库（2026-10-06）

产品列表、关联卡片、首页产品分类图和详情页主图均等比例完整显示，周围留白用于容纳横图及竖图，图注位于图片下方。十个产品详情页加入 2–3 张现有素材组成的图库，可切换缩略图、点击主图放大，并用左右键浏览；原图内容未裁改。软包和部分空间舱只具备资料图，页面保留产品参考／布局示意标签，未补造实拍。gallery.js 管理图库交互，保持静态 GitHub Pages 部署。


## MNQ014 正反面图片精修

工具：内置 image_gen；编辑用户提供的真实产品照片。原图保留在 G:/服装店/产品/MNQ014/，未改写。

- wall panel (4).jpg → assets/padding-mnq014-front-retouched.png / .webp：正面主图。
- wall panel (2).jpg → assets/padding-mnq014-back-retouched.png / .webp：背面图库。

网站的 Products、首页分类入口及相关产品卡片同步使用精修正面，MNQ014 详情保留正面、背面、产品资料、布局示意四个视图。图片完整显示，不裁切；PNG 为精修原尺寸图，WEBP 为网页编码版本。

精修要求：统一浅灰背景、整理曝光与白平衡、清理拍摄环境、保留织物纹理、原有形状和真实包边；背面保留木质背板、钉脚和边缘折叠。图片经过 AI 辅助精修，原照片是结构与规格核对依据，未据图片新增尺寸、材料等级或认证承诺。


## 全站设计统一检查 — 2026-10-12
- 所有 19 页加载 consistency.css：统一浅色卡片的标题、默认背景、悬停/键盘聚焦状态。
- 产品列表、相关产品、参考布局、资料卡和 P8 功能卡沿用同一交互色；保留深色技术/询价区。
- 五个配件页补充 FAQ 引导和预填产品的询盘入口；桌面垂直居中，手机单列。
- 相关产品控制台卡改为同宽排列，避免跨列后留空；规格/规划介绍与右侧内容对齐。
- 保持设备/场景图片完整显示，增强表头对比；保留减少动态效果设置。
- 实际 Chrome 检查 19 页 × 桌面 1440 / 手机 390：正文标题、表单文字及表格的对比检查；图片加载、横向溢出和脚本错误检查。
- 实际浏览器交互检查通过：套装匹配与询盘、四张玩法图片预览/键盘切换/Esc、产品图库、FAQ展开与询盘、卡片悬停及手机菜单。
