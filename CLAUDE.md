# CLAUDE.md

本檔案為 Claude Code 在此子資料夾工作時的指引。此資料夾**本身是獨立 git 儲存庫**，不受根目錄工作區規則約束（除語言等全域偏好）。

## 這是什麼

全年度行銷行事曆產生器——單檔前端工具。以「天時、地利、人和」三維度交織 52 週時間線規劃全年度行銷檔期：

- **天時**：目標市場（TA）真正會過的節慶檔期（雙11、母親節、中秋節……），刻意排除品牌自己的生日或週年慶這類消費者無感的日子
- **地利**：品牌與消費者實際發生交易的通路（使用者自行列出，如官網商城／實體店／特殊通路）
- **人和**：自媒體／他媒體／CRM／活動／策展／異業六大整合行銷工具（使用者勾選目前實際在用的）

型態仿 `new-product-strategy-studio`（規則式引擎為主＋選用 BYOK AI 優化）與 `coffee-ig-planner`（**不套用序號授權**，manual-first 公開工具定位）。**無後端、無序號授權、無 exe**。

## 架構

- `index.html` — 表單（品牌變數／地利通路動態清單／人和六大工具勾選／起始週與涵蓋週數）＋52週時間軸（`.timeline-grid`，CSS Grid，橫軸週次縱軸天時/地利/人和三列，有檔期的週次顯示寬卡片、空週只留細刻度）＋檔期總覽表（`table`，供橫向比較與列印）。單一 IIFE `<script>`（另有 2 個獨立 IIFE：跑馬燈／PWA安裝，互不相依）。
- `data.js` — `window.AMC_DATA`：`CHANNELS`（六大整合行銷工具定義）、`PLACE_TYPE_LABELS`（地利通路三種類型）、`INDUSTRY_LABELS`＋6個產業桶（`beautyFashion`/`foodBeverage`/`electronics3c`/`eduChildren`/`healthWellness`/`general`）、`NATIONAL_FESTIVALS`（18個全國性檔期，priority 1=優先保留 2=次要）、`INDUSTRY_FESTIVALS`（各產業桶4個專屬檔期）、`SYNERGY_TEMPLATES`（3個「戰略整合共鳴」規則式模板變體）、`hashString()`、`PRESETS`（5組範例，涵蓋5個產業桶）。**這是規則引擎的唯一真實來源**。

### 規則式引擎（`index.html` 內，免API金鑰，同輸入必同輸出）

- `buildFestivalPool(industry)` — 全國性檔期 + 該產業桶的專屬檔期。
- `selectFestivals(pool, startWeek, weeksCount)` — 依 `displayIndex=(week-startWeek+52)%52` 篩出落在設定期間內的檔期（`weeksCount>52` 時支援跨年度），依 `priority` 再 `displayIndex` 排序，超過18檔則裁到18（`priority=2` 的次要檔期優先被裁掉），最後依 `displayIndex` 排回時間序。
- `pickPlaces(userPlaces, placeHint)` — 依檔期的 `placeHint`（通路類型優先序）從使用者填的地利清單挑最多2個；使用者清單裡沒有符合類型的話退回第一筆。
- `pickPeople(userChannels, peoplePriority)` — 依檔期的 `peoplePriority`（六大工具優先序）從使用者勾選的工具挑最多3個；使用者完全沒勾中優先序內的話退回前2個已勾選項目。
- `buildSynergy(festival, form, places, peopleLabels)` — 用 `hashString(festival.id+brandName)` 確定性挑選 `SYNERGY_TEMPLATES` 其中一個變體，套入 `{{FESTIVAL}}/{{TA}}/{{BRAND}}/{{PLACE}}/{{PEOPLE}}`。
- `buildOverviewRule(form, items)` — 組出「顧問總評」段落，統計檔期數／地利／人和。

### AI優化路徑（選用，BYOK）

`AI_PROVIDERS`／`callLLM()`／`parseJsonObject()` 與 `new-product-strategy-studio`／`coffee-ig-planner` 同一套實作（Claude 需 `anthropic-dangerous-direct-browser-access` header；429/500/503/529 重試3次；180秒逾時）。**不逐檔期個別呼叫 API**（避免18次請求），而是一次把整份規則式排定的檔期清單（id/週次/檔期名稱/地利/人和）送給 AI，請它一次回傳所有檔期優化過的「戰略整合共鳴」文案＋一段「顧問總評」，`validateAiResult(parsed, ruleItems)` 逐筆核對 `id` 是否存在、`synergy` 長度是否合理，只有驗證通過的檔期會被替換（`textSource:'ai'`），其餘保留規則式文字（`textSource:'rule'`）——不是全有全無。整支 AI 呼叫失敗時，整份行事曆完全退回規則式結果，不會開天窗。

### localStorage

`amcFormState`（表單：品牌/產業/TA/起始週/涵蓋週數/地利清單/人和勾選/AI補充描述）、`amcResultState`（目前渲染中的行事曆結果，含每檔期 `textSource`）、`amcApiConfig`（`{provider,model,apiKey}`）、`amcMarquee`（跑馬燈快取）。

## 52 週時間軸（`.timeline-grid`）

CSS Grid 動態產生：第1欄固定寬（`天時/地利/人和` sticky 列標籤），之後每週一欄，寬度依該週有無檔期動態決定（有檔期180px、無檔期20px細刻度），`grid-template-rows` 固定4列（週次刻度＋天時/地利/人和）。這是本工具的 signature 視覺元素，直接對應使用者原始需求「橫軸為52週時間線，縱軸交叉天時地利人和」。下方另有一份 `table` 檔期總覽表（週次/日期/天時/地利/人和/戰略整合共鳴），供橫向捲動閱讀與列印，兩者資料來源相同（`state.result.items`），互為視覺與資訊密度的互補呈現。

## 視覺主題

深靛藍＋金色（`--navy`/`--gold` 系列），固定深色（不隨 OS 淺色模式切換），比照 `costar-game`「深藍星空」的做法——呼應「52週時間軸如星圖」的視覺概念，且與工作區既有的淺色 `coffee-ig-planner`、靛藍 `new-product-strategy-studio`（會隨OS切換）等主題區隔。

## PDF 匯出浮水印

`#pdfWatermark > img#wmImg`，`src` 直接指向本專案自己的 `icons/icon-512.png`（深靛藍底＋金色行事曆格線圖示），**不是**沿用其他專案共用的「馬克老師」吉祥物浮水印圖——用自己的品牌圖示做浮水印，避免圖檔管理分散。`<img>` 標籤在列印時不受瀏覽器「列印背景圖形」開關影響（該開關只擋 CSS `background-image`），`@media print` 下 `display:flex`＋`opacity:.13` 置中顯示。

## 頂部跑馬燈

沿用工作區共用的 Google Apps Script 端點（與 `coffee-ig-planner`／`new-product-strategy-studio` 等多個姊妹工具共用同一個 Google Sheet），做法逐字複製自 `coffee-ig-planner/index.html`。改跑馬燈內容直接編輯共用 Sheet 即可，不需要重新部署任何 Apps Script。

## 隱私與警語

無伺服器端經手任何使用者資料。品牌資料、地利/人和設定、AI設定皆只存在使用者瀏覽器的 localStorage。首頁與手冊皆明列使用警語：規則式內容為虛構示範、農曆檔期週次為近似值需自行對照當年月曆、AI內容需自行查核、請勿輸入真實個資或機密資料、僅供教學與個人使用禁止商業化。

## 本次未做（後續視需要再處理）

- 未套用序號授權（使用者明確選擇比照 `coffee-ig-planner` 的 manual-first 公開工具模式）。
- 未打包可攜式桌面版 exe。
- 未推公開 GitHub repo / GitHub Pages（待使用者確認後再處理）。

## 指令

無建置/測試指令。修改 `index.html`／`data.js`／`manual.html` 後直接用瀏覽器開啟驗證，或暫起 `python -m http.server 8817 --directory 行銷內容工具/annual-marketing-calendar` 測完關閉（port 已登記於 `.claude/launch.json`）。修改內嵌 `<script>` 後可用以下方式快速檢查語法：

```bash
python -c "
import re
html = open('index.html', encoding='utf-8').read()
for i, s in enumerate(re.findall(r'<script>(.*?)</script>', html, re.S)):
    open(f'_check{i}.js', 'w', encoding='utf-8').write(s)
"
node --check _check0.js && node --check _check1.js && node --check _check2.js
node --check data.js
```

驗證 AI 路徑不需要真實金鑰：可在瀏覽器 console 攔截 `window.fetch` 回傳假的 provider 回應格式，確認 `callLLM → parseJsonObject → validateAiResult → renderAll` 整條管線正確（含單一檔期驗證失敗時的單點 fallback、整體失敗時的完全退回規則式）。已用 Playwright 端對端驗證過：5組範例規則式產生（18檔期上限＋跨產業差異）、起始週/涵蓋週數含跨年度wraparound篩選、地利/人和動態清單增刪、AI成功路徑（含逐檔期fallback與顧問總評套用）、AI失敗路徑（含一次意外打到真實OpenAI API觸發401後正確退回規則式，行事曆未損毀）、375px手機寬度無橫向溢出、PDF浮水印圖片正確載入。
