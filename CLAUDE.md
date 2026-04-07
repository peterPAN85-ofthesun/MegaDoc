# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Vault Overview

Personal Zettelkasten knowledge base managed with Obsidian and Claude Code. Notes flow from raw capture → permanent atomic notes → thematic maps.

## Folder Structure

| Folder | Purpose |
|--------|---------|
| `0-Inbox/` | Raw notes, captures brutes. Source for atomization. Processed notes move to `0-Inbox/Archive/` |
| `1-Permanent/` | Atomic permanent notes (one concept per file) |
| `2-Maps/` | MOCs (Maps of Content) — thematic indexes |
| `3-Projet/` | Project-specific notes |
| `Archive/` | Archived vault-level content |
| `Assets/` | Images and media, organized in subfolders by topic (e.g. `Assets/Formation UHD-HDR/`) |
| `Templates/` | Note templates: `Permanent Note.md`, `Map of Content.md`, `Fleeting Note.md`, `Literature Note.md` |

## Slash Commands (`.claude/commands/`)

| Command | Purpose |
|---------|---------|
| `/process-current-note` | Full automated processing of current note: atomize → create permanent notes → update MOC |
| `/atomize [file]` | Extract atomic concepts from a source and create permanent notes |
| `/create-note [concept]` | Create a single atomic permanent note |
| `/find-links [note]` | Find relevant connections between a note and existing vault notes |
| `/update-moc [moc-name]` | Create or update a Map of Content |
| `/process-inbox` | Process all files in `0-Inbox/` |
| `/audit [note]` | Verify note quality (atomicity, links, clarity) |
| `/execute-clauses` | Scan `0-Inbox/` for `>[!Claude]` callouts and execute their instructions |

## Agents (`.claude/agents/`)

- `zettelkasten-archiver` — Move processed inbox notes to `0-Inbox/Archive/` preserving folder structure
- `zettelkasten-note-normalizer` — Standardize permanent note naming conventions
- `zettelkasten-knowledge-responder` — Answer questions using `1-Permanent/` content
- `obsidian-link-repairer` — Fix broken wiki-links after file renames/moves

## Special Markers in Notes

### `[IMAGE]` marker
When a note contains `[IMAGE]` after an Obsidian image link, **read the image** with the Read tool to extract its content (text, tables, diagrams).

Recognized patterns:
```
![[image.jpg]] [IMAGE]       ← same line, space
![[image.jpg]][IMAGE]        ← same line, no space
![[image.jpg]]               ← image link
[IMAGE]                      ← marker on next line
```

Image path resolution: look in `Assets/<topic-subfolder>/`. Use Glob if the path is not obvious.

### `>[!Claude]` callouts
Actionable instructions embedded in notes, addressed to Claude. Use `/execute-clauses` to process them. After execution, mark as `>[!Claude] ✅`.

## Permanent Note Structure

File location: `1-Permanent/<Descriptive Title>.md`

Required frontmatter:
```yaml
---
type: permanent
created: YYYY-MM-DD HH:mm
tags:
  - permanent
  - [theme]
---
```

Sections: abstract summary, Explication (2-3 paragraphs), Exemples, Cas d'usage, Connexions (minimum 3 links to other notes), Source.

## MOC Structure

File location: `2-Maps/MOC - <Theme>.md`

Required frontmatter: `type: moc`, `tags: [moc, index, theme]`

## Atomicity Rules

A concept is atomic if it represents **one single idea**, is self-contained, and has a descriptive title.
- ✅ `NAT - Network Address Translation`
- ❌ `Réseau` (too broad)

## Link Repair

After any file rename or move, invoke the `obsidian-link-repairer` agent to fix broken wiki-links throughout the vault.

## Language

Note content in French. Technical terms may remain in English.
