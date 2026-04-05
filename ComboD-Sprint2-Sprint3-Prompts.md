# Combo D Dashboard — Sprint 2 + Sprint 3 Prompts
# Run sequentially in Claude Code after Sprint 1 completes
# Same folder: combo-d-dashboard/

---

# ═══════════════════════════════════════════════════════
# SPRINT 2: Document Viewer + KB Explorer + Governance
# Run after Sprint 1 is working
# ═══════════════════════════════════════════════════════

```
Continue building the Combo D dashboard. Sprint 1 is complete 
with project selector, project overview, and context setup.

Sprint 2 adds depth to the three tab panels on the project 
overview page.

## 1. DOCUMENT VIEWER (Documents tab)

Currently shows agent accordion with doc titles. Enhance:

- Each agent section is an expandable accordion panel
- Agent header shows: number, name, run time, gate badge
- Gate badges use colors:
  - green (#10B981): PASS, PASS WITH CONDITIONS
  - amber (#F59E0B): PARTIAL
  - red (#EF4444): NO-GO, FAIL
  - navy (#0B1D2E): ANALYSIS CLOSURE
- Expand agent → shows list of document cards
- Each doc card shows: doc number, title, subtitle (from data)
- Click doc card → expands inline to show document content
- For MVP: document content is a summary paragraph stored in 
  the JSON data (not parsing actual Word docs)

Add document content to the data files. For CloudSync Agent 1, 
add a "content" field to each document with a 2-3 paragraph 
summary of what that document contains. Example:

{
  "id": "01",
  "title": "Context Analysis",
  "subtitle": "12 claims verified, 10 gaps found",
  "content": "The Context Analysis verified 12 claims from the 
  project brief against industry benchmarks and available 
  evidence. Of these, 10 information gaps were identified...\n\n
  Key findings include: the $850K budget falls 45% below 
  industry benchmarks for a migration of this complexity..."
}

Add content for all 8 Agent 1 documents. For Agents 2-6, 
add content for at least 2 key documents each.

## 2. KNOWLEDGE BASE EXPLORER (Knowledge Base tab)

Build a full KB explorer:

### Cluster overview cards (top of tab)
- 7 cluster cards in a horizontal scrollable row
- Each card shows: cluster name, entry count, trend badge
- Trend badges: DOMINANT (red), GROWING (amber), STABLE (gray)
- Click a cluster card → filters the table below to that cluster

### KB entries table
- Columns: ID, Pattern Tag, Severity, Cluster, Agent, Summary
- Sortable by any column (click header to sort)
- Searchable: text input at top filters across all columns
- Severity uses color coding:
  - CRITICAL (red bg)
  - HIGH (amber bg)  
  - MEDIUM (blue bg)
  - LOW (gray bg)
- Click row → expands to show full entry:
  - Description
  - Detection signals
  - Prevention recommendation
  - Agent source
  - Related entries

### Prevention playbook section
- Below the table: collapsible section "Prevention Playbook"
- Shows rules grouped by cluster
- Each rule: IF [detection signal] THEN [prevention action]

Create /data/cloudsync/knowledge-base.json with at least 
15 representative entries covering all 7 clusters:
1. Decision / Governance (8 entries — DOMINANT)
2. Inadequate Preparation (7 entries)
3. Stakeholder / Org (5 entries)
4. Vendor / Technical (5 entries)
5. Budget / Resource (4 entries)
6. Optimism / Self-Assessment (4 entries)
7. Timeline / Schedule (3 entries)

Use real pattern tags from the v2.3 vocabulary:
decision-debt-accumulating, governance-execution-gap, 
sponsor-disengagement, assumption-gap, rollback-absence,
vendor-bias, compliance-underestimation, budget-overreach,
resource-constraint, timeline-pressure, scope-fiction,
optimism-bias, change-resistance, communication-gap, etc.

## 3. GOVERNANCE TRACKER (Governance tab)

Build a governance decision manager:

### Decision cards layout
- Cards in a vertical list (not grid — these are sequential)
- Each card shows:
  - Decision title (bold)
  - Status badge: PENDING (amber), DECIDED (green), 
    VERIFIED (blue), OVERDUE (red)
  - Owner name
  - Deadline date (red text if past due)
  - Impact statement
  - Related defects (clickable links to KB entries)
  - Evidence field (empty if PENDING, filled if DECIDED)

### Status logic
- If deadline < today AND status = PENDING → show as OVERDUE
- Sort: OVERDUE first, then PENDING, then DECIDED, then VERIFIED

### Edit capability (MVP)
- "Update Status" button on each card
- Opens inline form: change status dropdown, add evidence text
- Save updates to localStorage
- Show a "Last updated" timestamp on each card

### Summary bar at top
- "4 decisions tracked: 0 decided, 4 pending, 0 overdue"
- Progress bar showing decided/total ratio

Use the 4 governance decisions from the CloudSync data:
GOV-001 (Hire PM), GOV-002 (Confirm Budget), 
GOV-003 (Confirm Scope), GOV-004 (Sign Charter)

## GENERAL

- Maintain consistent design with Sprint 1
- All new components should use the same color system 
  and typography
- Ensure mobile responsive
- Test all three tabs work correctly with data

After completing, show me the full route structure and 
confirm all tabs are functional.
```

---

# ═══════════════════════════════════════════════════════
# SPRINT 3: Polish + Agent 0 + Deploy
# Run after Sprint 2 is working
# ═══════════════════════════════════════════════════════

```
Continue building the Combo D dashboard. Sprints 1-2 are 
complete. Sprint 3 focuses on polish, Agent 0 assessment 
viewer, and deployment.

## 1. AGENT 0 ASSESSMENT VIEWER

Add an assessment section to the project overview page, 
accessible via a tab or a section above the pipeline.

### Radar chart (7 dimensions)
Build a radar/spider chart showing the 7 maturity dimensions:
1. Project Initiation
2. Planning & Estimation
3. Risk Management
4. Quality & Governance
5. Knowledge Management
6. Process Standardization
7. Stakeholder Management

For CloudSync, use these scores (from Agent 0 assessment):
- Project Initiation: 2
- Planning & Estimation: 2
- Risk Management: 1
- Quality & Governance: 1
- Knowledge Management: 1
- Process Standardization: 2
- Stakeholder Management: 2

Use SVG for the radar chart. Axes in navy, data polygon 
in coral with 20% opacity fill.

### Overall maturity badge
- Score: 1.6 / 5.0
- Level: "Ad Hoc"
- Color coded: red for 1-1.9, amber for 2-2.9, blue for 3-3.9, 
  green for 4-5

### Per-dimension recommendation cards
- Below the radar chart: 7 cards (one per dimension)
- Each shows: dimension name, score, level, recommendation
- Scores ≤ 2 get "Critical gap" tag (red)
- Scores 3 get "Room to improve" tag (amber)
- Scores ≥ 4 get "Strong" tag (green)

### Chain configuration panel
- Show the recommended config.json as a visual toggle panel
- Feature flags as toggle switches
- co_pilot_detail as dropdown (full/summary/minimal)
- Read-only for now (editable in context setup page)

Add assessment data to /data/cloudsync/assessment.json

## 2. PIPELINE VISUALIZATION POLISH

Upgrade the agent pipeline from Sprint 1:

### Horizontal flow with connectors
- 6 agent cards in a horizontal scrollable row on desktop
- Cards connected by arrow lines between them
- Below agent 5: show the "FAIL → Agent 3 remediation loop" 
  as a curved return arrow (dashed line)
- Each card shows animated pulse on the gate badge if status 
  is active/in-progress

### Agent detail panel
- Clicking an agent card opens a detail panel below the pipeline
  (or slides in from the right on desktop)
- Shows: full summary, document count, key findings, 
  link to "View documents" (switches to Documents tab 
  filtered to that agent)

### Run summary bar
- Sticky bar below the pipeline:
  "6 agents · 91 minutes · 45 documents · 39 KB entries · 
  Verdict: Grade F (62.9%)"

## 3. SECOND PROJECT: COMBO D DATA

Add the Combo D dashboard project as a second project card.

Create /data/combo-d/ folder with:
- agents.json (only Agent 1 completed, rest pending)
- knowledge-base.json (12 entries from Agent 1 output)
- governance.json (empty — no governance decisions yet)
- assessment.json (null — Agent 0 not yet run)

This shows multi-project capability in the demo.

## 4. MOBILE RESPONSIVE PASS

- Test all pages at 375px (iPhone), 768px (iPad), 1440px
- Sidebar collapses to hamburger menu on mobile
- Pipeline scrolls horizontally on mobile
- KB table becomes card layout on mobile
- Governance cards stack vertically

## 5. FINAL POLISH

- Add loading skeleton screens for data fetch simulation
- Add empty states: "No documents yet" for pending agents
- Add breadcrumb: Projects > CloudSync > Documents
- Page title updates per route
- Favicon: use a simple "PM" monogram or chain icon
- Meta tags for sharing (og:title, og:description)

## 6. DEPLOY

After everything is working:

1. Initialize git: git init
2. Create .gitignore (node_modules, .next, etc.)
3. git add . && git commit -m "Combo D Dashboard MVP v1.0"
4. Create GitHub repo (if possible) or prepare for manual 
   Vercel deployment
5. Deploy to Vercel:
   - If GitHub connected: push and auto-deploy
   - If not: npx vercel --prod
6. Report the live URL

The dashboard should be demo-ready at the deployed URL.
Show me the final route structure, feature checklist, 
and deployment URL.
```
