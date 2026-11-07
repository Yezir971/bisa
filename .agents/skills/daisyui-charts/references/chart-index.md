# Chart index

100 ready-to-adapt recipes. Pick by **question**, open the file, copy the code, replace the data.

## Which chart for which question?

| Question | Family | Start with |
|---|---|---|
| How does a metric evolve? | line / area | `line-chart-1`, `area-chart-2` |
| Compare this period vs the previous one | line / area / column | `line-chart-4`, `area-chart-14`, `column-chart-3` |
| Compare categories | column / bar | `column-chart-1`, `bar-chart-2` |
| Rank items | bar | `bar-chart-2`, `bar-chart-9` |
| Parts of a whole (≤ 5) | pie | `pie-chart-2`, `pie-chart-4` |
| Parts of a whole over time | area / column (stacked) | `area-chart-4`, `column-chart-4` |
| Progress toward a goal | radial / bar | `radial-chart-1`, `bar-chart-7` |
| Value against thresholds | radial | `radial-chart-6` |
| Profile on several dimensions | radar | `radar-chart-2` |
| Patterns by day/hour/cohort | heatmap | `heatmap-chart-2`, `heatmap-chart-4` |
| Amount + rate together | mixed | `mixed-chart-1` |
| Distribution | column | `column-chart-15` |
| Explain a bridge between two values | column | `column-chart-14` |
| KPI trend in a small space | line / area | `line-chart-8`, `area-chart-10` |

## Line charts (15)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic smooth line](charts/line/line-chart-1.md) | A single metric over time (visitors, revenue, MRR). |
| 2 | [Multi-series lines](charts/line/line-chart-2.md) | Comparing 2–4 series on the same unit (channels, regions, plans). |
| 3 | [Stepped line](charts/line/line-chart-3.md) | Values that change at discrete moments: pricing, stock level, plan limits, status counts. |
| 4 | [Dashed comparison with previous period](charts/line/line-chart-4.md) | Period-over-period comparison (this year vs last year). |
| 5 | [Visible data points](charts/line/line-chart-5.md) | Few data points (≤ 12) where each value matters, or sparse measures. |
| 6 | [Highlighted last point](charts/line/line-chart-6.md) | Drawing attention to the current value while keeping the trend readable. |
| 7 | [Line with target threshold](charts/line/line-chart-7.md) | Tracking a metric against a target, SLA or budget. |
| 8 | [Sparkline in a stat card](charts/line/line-chart-8.md) | KPI cards that need a hint of trend without taking space. |
| 9 | [Sparkline grid](charts/line/line-chart-9.md) | Dashboards listing several services or metrics at once. |
| 10 | [Min / max band with average](charts/line/line-chart-10.md) | Showing variability: temperature, latency percentiles, price ranges. |
| 11 | [Logarithmic scale](charts/line/line-chart-11.md) | Data spanning several orders of magnitude (growth, traffic spikes). |
| 12 | [Dense time series (90 points)](charts/line/line-chart-12.md) | Daily/hourly data over weeks or months. |
| 13 | [Series with point-style legend](charts/line/line-chart-13.md) | Dashboards where users compare series values at one moment. |
| 14 | [Crosshair tooltip](charts/line/line-chart-14.md) | Precise reading of values across several series. |
| 15 | [Percentage axis](charts/line/line-chart-15.md) | Rates and ratios: conversion, retention, uptime, completion. |

## Area charts (15)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic area](charts/area/area-chart-1.md) | Magnitude over time for a single metric. |
| 2 | [Gradient area](charts/area/area-chart-2.md) | Hero chart on a dashboard, a more polished single-series trend. |
| 3 | [Overlapping areas](charts/area/area-chart-3.md) | Comparing series whose values do not hide each other (ordered from largest to smallest). |
| 4 | [Stacked area](charts/area/area-chart-4.md) | Part-to-whole over time: traffic by channel, revenue by product. |
| 5 | [100 % stacked area](charts/area/area-chart-5.md) | Share of each category over time rather than absolute values. |
| 6 | [Stepped area](charts/area/area-chart-6.md) | Capacity, inventory or plan limits that change at specific times. |
| 7 | [Area with threshold](charts/area/area-chart-7.md) | Showing when a metric exceeds a limit (CPU, quota, budget). |
| 8 | [Positive / negative area](charts/area/area-chart-8.md) | Values oscillating around zero: profit/loss, net change, variance. |
| 9 | [Forecast with confidence band](charts/area/area-chart-9.md) | Projections with uncertainty (revenue forecast, capacity planning). |
| 10 | [Mini area sparkline](charts/area/area-chart-10.md) | Compact KPI cards with a softer look than a plain sparkline. |
| 11 | [Smooth stream stack](charts/area/area-chart-11.md) | Expressive composition over time when exact values matter less than the shape. |
| 12 | [Area with dashed projection](charts/area/area-chart-12.md) | Mixing actual and estimated values on the same series. |
| 13 | [Area with highlighted peak](charts/area/area-chart-13.md) | Pointing out the best (or worst) moment of a period. |
| 14 | [Current vs previous period](charts/area/area-chart-14.md) | Period-over-period comparisons where the current period is the story. |
| 15 | [Gradient multi-series areas](charts/area/area-chart-15.md) | A polished two-series comparison with a modern look. |

## Column charts (17)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic columns](charts/column/column-chart-1.md) | One value per category or period. |
| 2 | [Pill columns](charts/column/column-chart-2.md) | A lighter, modern look for many columns (weeks, days). |
| 3 | [Grouped columns](charts/column/column-chart-3.md) | Comparing 2–3 series per category. |
| 4 | [Stacked columns](charts/column/column-chart-4.md) | Part-to-whole per period with a few categories. |
| 5 | [100 % stacked columns](charts/column/column-chart-5.md) | Comparing composition across periods regardless of totals. |
| 6 | [Positive / negative columns](charts/column/column-chart-6.md) | Variance, net change, profit & loss. |
| 7 | [Highlighted max column](charts/column/column-chart-7.md) | Pointing to the best period or category. |
| 8 | [Columns with value labels](charts/column/column-chart-8.md) | Few columns (≤ 8) where reading exact values matters. |
| 9 | [Columns with target line](charts/column/column-chart-9.md) | Comparing each period to a target. |
| 10 | [Thin columns](charts/column/column-chart-10.md) | Dense categories (24 hours, 31 days) where thick bars would collide. |
| 11 | [Gradient columns](charts/column/column-chart-11.md) | A more decorative hero chart. |
| 12 | [Categorical colours](charts/column/column-chart-12.md) | Unordered categories where identity matters (channels, teams). |
| 13 | [Floating range columns](charts/column/column-chart-13.md) | Ranges per period: temperatures, price min/max, response time p50–p95. |
| 14 | [Waterfall](charts/column/column-chart-14.md) | Explaining how a start value becomes an end value (revenue bridge, budget). |
| 15 | [Histogram](charts/column/column-chart-15.md) | Distribution of a continuous value (order amount, latency). |
| 16 | [Grouped + stacked columns](charts/column/column-chart-16.md) | Comparing two stacked breakdowns side by side (this year vs last year by channel). |
| 17 | [Weekday with today highlighted](charts/column/column-chart-17.md) | Weekly activity where "today" matters. |

## Bar charts (10)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic horizontal bars](charts/bar/bar-chart-1.md) | Comparing categories, especially with longer labels. |
| 2 | [Top pages with long labels](charts/bar/bar-chart-2.md) | Rankings with long text labels (pages, products, customers). |
| 3 | [Grouped horizontal bars](charts/bar/bar-chart-3.md) | Comparing 2–3 series across ranked categories. |
| 4 | [Stacked horizontal bars](charts/bar/bar-chart-4.md) | Composition per category (e.g. status per team). |
| 5 | [100 % stacked horizontal bars](charts/bar/bar-chart-5.md) | Comparing mix between categories of different sizes. |
| 6 | [Bars with value labels](charts/bar/bar-chart-6.md) | Short rankings (≤ 8) where exact values matter. |
| 7 | [Progress bars with track](charts/bar/bar-chart-7.md) | Goal completion per item (teams, projects, quotas). |
| 8 | [Diverging bars](charts/bar/bar-chart-8.md) | Positive vs negative variations per category (NPS change, budget variance). |
| 9 | [Ranked with highlighted leader](charts/bar/bar-chart-9.md) | Leaderboards where #1 matters most. |
| 10 | [Timeline (floating bars)](charts/bar/bar-chart-10.md) | Schedules, durations, availability windows. |

## Pie charts (12)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic pie](charts/pie/pie-chart-1.md) | Part-to-whole with ≤ 5 slices and clear differences. |
| 2 | [Doughnut](charts/pie/pie-chart-2.md) | Default part-to-whole choice: easier to read than a pie and leaves room for a total. |
| 3 | [Thin doughnut](charts/pie/pie-chart-3.md) | Minimal look for dashboards with few segments. |
| 4 | [Doughnut with total in center](charts/pie/pie-chart-4.md) | When the total is as important as the split. |
| 5 | [Half doughnut](charts/pie/pie-chart-5.md) | Compact gauge-like splits (target vs rest, 2–3 segments). |
| 6 | [Doughnut with side legend](charts/pie/pie-chart-6.md) | When labels and values need more room than the default legend. |
| 7 | [Pie with exploded slice](charts/pie/pie-chart-7.md) | Emphasising one segment in a story-driven view. |
| 8 | [Doughnut with gaps](charts/pie/pie-chart-8.md) | Clean, modern look for 3–5 segments. |
| 9 | [Rounded-segment doughnut](charts/pie/pie-chart-9.md) | Playful, friendly dashboards (fitness, finance apps). |
| 10 | [Nested doughnut](charts/pie/pie-chart-10.md) | Comparing the same split across two periods. |
| 11 | [Polar area](charts/pie/pie-chart-11.md) | Comparing magnitudes of several categories in a compact radial layout. |
| 12 | [Pie with percentage labels](charts/pie/pie-chart-12.md) | Pies where the share matters more than the legend. |

## Radial charts (13)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic radial progress](charts/radial/radial-chart-1.md) | A single completion/progress value. |
| 2 | [Sizes and thickness](charts/radial/radial-chart-2.md) | Showing hierarchy between metrics or documenting size variants. |
| 3 | [Status colours](charts/radial/radial-chart-3.md) | Quota/health indicators where the colour carries meaning. |
| 4 | [Ring with label and caption](charts/radial/radial-chart-4.md) | A hero KPI with its context (goal, period). |
| 5 | [KPI rings grid](charts/radial/radial-chart-5.md) | Dashboard rows of completion KPIs. |
| 6 | [Gauge with colour ranges](charts/radial/radial-chart-6.md) | A value that must be read against thresholds (score, load, risk). |
| 7 | [Semi-circle progress](charts/radial/radial-chart-7.md) | A single progress value in a compact, wide space. |
| 8 | [Activity rings](charts/radial/radial-chart-8.md) | Several goals shown together (calories / move / stand style). |
| 9 | [Doughnut progress with percent](charts/radial/radial-chart-9.md) | A progress value that needs Chart.js tooltips or animations. |
| 10 | [Segmented ring with legend](charts/radial/radial-chart-10.md) | Showing how a total goal is composed. |
| 11 | [Radial progress inside a stat](charts/radial/radial-chart-11.md) | KPI cards where the ring complements a number. |
| 12 | [Goal tracker list](charts/radial/radial-chart-12.md) | Personal or team goals with progress. |
| 13 | [CSS semi-circle gauge](charts/radial/radial-chart-13.md) | A lightweight gauge without any JS library. |

## Radar charts (6)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Basic radar](charts/radar/radar-chart-1.md) | Profile of a single entity across 5–8 dimensions on the same scale. |
| 2 | [Two-series radar](charts/radar/radar-chart-2.md) | Comparing two entities (us vs competitor, this vs last quarter). |
| 3 | [Outline-only radar](charts/radar/radar-chart-3.md) | Three or more overlapping series where fills would hide each other. |
| 4 | [Points-only radar](charts/radar/radar-chart-4.md) | Comparing positions on dimensions without implying a shape. |
| 5 | [Circular-grid radar](charts/radar/radar-chart-5.md) | A softer look for scores with many dimensions. |
| 6 | [Scored radar with ticks](charts/radar/radar-chart-6.md) | Reports where readers must read exact levels. |

## Heatmap charts (7)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Calendar heatmap](charts/heatmap/heatmap-chart-1.md) | Daily activity over a year (commits, orders, logins). |
| 2 | [Weekday × hour matrix](charts/heatmap/heatmap-chart-2.md) | Finding peak times (traffic, support load, orders). |
| 3 | [Correlation matrix](charts/heatmap/heatmap-chart-3.md) | Showing relationships between metrics (−1 to +1). |
| 4 | [Cohort retention table](charts/heatmap/heatmap-chart-4.md) | Retention or conversion by cohort and elapsed period. |
| 5 | [Month × year grid](charts/heatmap/heatmap-chart-5.md) | Seasonality and year-over-year patterns. |
| 6 | [Uptime status strip](charts/heatmap/heatmap-chart-6.md) | Service availability history (status pages). |
| 7 | [Heatmap with gradient legend and selection](charts/heatmap/heatmap-chart-7.md) | Interactive exploration where users inspect individual cells. |

## Mixed charts (5)

| # | Recipe | Use when |
|---|---|---|
| 1 | [Bars + line on a second axis](charts/mixed/mixed-chart-1.md) | Combining an absolute value and a rate (revenue + growth, volume + conversion). |
| 2 | [Stacked columns + total line](charts/mixed/mixed-chart-2.md) | Part-to-whole plus total trend. |
| 3 | [Area + bars](charts/mixed/mixed-chart-3.md) | A funnel-like relationship between volume and outcome. |
| 4 | [Bars with moving average](charts/mixed/mixed-chart-4.md) | Smoothing noisy data while keeping raw values visible. |
| 5 | [Bars with event markers](charts/mixed/mixed-chart-5.md) | Annotating a time series with launches, incidents or campaigns. |
