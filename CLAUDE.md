# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Zettelkasten-based Obsidian vault designed for knowledge management, creative thinking, and idea generation. The system follows the Zettelkasten method developed by Niklas Luhmann, adapted for digital note-taking in Obsidian.

## Zettelkasten Philosophy

The Zettelkasten method is about:
- **Atomic notes**: One idea per note
- **Organic connections**: Links emerge naturally between related ideas
- **Progressive elaboration**: Notes evolve from fleeting → literature → permanent
- **Knowledge synthesis**: New insights emerge from connections

## Vault Structure

```
ObsidianZettle/
├── 0-Inbox/              # Quick captures, unprocessed notes
├── 1-Permanent/          # Atomic, evergreen notes (the core Zettelkasten)
├── 2-Maps/              # Maps of Content (MOCs) - thematic indexes
├── Assets/              # Images, files, media
├── Templates/           # Note templates
└── .obsidian/           # Obsidian configuration
```

## Note Types and Workflow

### 1. Permanent Notes (`1-Permanent/`)
**Purpose**: The heart of Zettelkasten - atomic, evergreen concepts.

**When to use**:
- You understand a concept fully
- The idea is atomic (single, focused concept)
- The note has value independently

**Characteristics**:
- **Atomic**: One idea only
- **Autonomous**: Understandable on its own
- **Personal**: Written in your own words
- **Connected**: Linked to related notes

**Workflow**:
1. Use template: `Templates/Permanent Note.md`
2. Write concept in 1-2 paragraphs max
3. Add examples if needed
4. Link to related Permanent notes
5. Add to relevant Map of Content

**Naming convention**: Use descriptive titles, not IDs
- ✅ Good: `Recursion in programming.md`
- ❌ Bad: `202501080130.md` or `Note1.md`

**Template tags**: `#permanent` + thematic tags

### 2. Maps of Content (`2-Maps/`)
**Purpose**: Thematic indexes that organize related notes.

**When to use**:
- You have 5+ notes on a topic
- You want to see the "big picture" of a domain
- Creating a learning path

**Examples**:
- `MOC - Programmation C.md`
- `MOC - Réseau.md`
- `MOC - Git & Versioning.md`

**Workflow**:
1. Use template: `Templates/Map of Content.md`
2. List all related Permanent notes
3. Organize by subtopics
4. Update regularly as the topic grows

**Template tags**: `#moc` `#index`

## Linking Strategy

### Internal Links
- Use `[[Note Title]]` format (Obsidian wiki-links)
- Link liberally - connections create value
- Add context: `See also [[Related Concept]] for more on X`

### Bi-directional Links
- Always check backlinks when writing a note
- Ask: "What existing notes relate to this?"
- Create explicit connections in both directions

### Tags
Use sparingly and consistently:
- **Type tags**: `#permanent` `#moc`
- **Domain tags**: `#réseau` `#programmation` `#git` `#cmake`
- **Status tags**: `#wip` `#à-revoir` `#complet`

Prefer links over tags - links create structure.

## Frontmatter Format

All notes use consistent YAML frontmatter:

```yaml
---
type: permanent|moc
created: YYYY-MM-DD HH:mm
tags:
  - tag1
  - tag2
source: "URL or book reference"  # Optional
author: "Author name"             # Optional
---
```

## Migration from Existing Vaults

When migrating from the old multi-vault structure:

### Step 1: Identify Note Type
Determine if each note should become:
- **Permanent**: Core concepts, well-understood ideas
- **Inbox**: Course notes, tutorials, documentation, quick notes
- **MOC**: HomePage files, glossaries, indexes

### Step 2: Transform Structure
- Course day notes (J1, J2, J3) → Inbox
- Technical concepts (VLANs, NAT, Git commands) → Permanent notes
- Glossaries → MOCs
- Templates → Keep in Templates/
- Day Planners → Archive or Inbox

### Step 3: Atomize
Break down large notes into atomic concepts:
- One concept per note
- Extract sub-topics into separate notes
- Link related concepts

### Step 4: Link
- Create connections between related concepts
- Build MOCs for each domain (Réseau, Git, C, etc.)
- Use graph view to verify connections

## Best Practices

### Writing Notes
1. **Write in your own words** - no copy-paste
2. **Be concise** - 1-2 paragraphs for Permanent notes
3. **Add examples** - concrete cases help understanding
4. **Explain like teaching** - clarity over cleverness

### Organizing
1. **Don't overthink folders** - use search and links instead
2. **Trust the process** - structure emerges over time
3. **Regular reviews** - process Inbox notes weekly
4. **Update MOCs** - keep indexes current

### Linking
1. **Link when writing** - not retroactively
2. **Explain connections** - why are notes related?
3. **Follow the trail** - read linked notes, discover new connections
4. **Use graph view** - visualize knowledge structure

## Git Workflow

```bash
# Regular workflow
git add .
git commit -m "Add notes on [topic]"
git push

# Commit message examples
git commit -m "Add permanent note: TCP handshake process"
git commit -m "Create MOC: Networking fundamentals"
git commit -m "Process fleeting notes from 2025-01-08"
git commit -m "Migrate Formation_Reseau vault"
```

## Common Mistakes to Avoid

1. **Too many tags** - Use links instead
2. **Notes too long** - Keep Permanent notes atomic
3. **Not processing Inbox** - Review and process regularly
4. **Copying without understanding** - Always rewrite in your own words
5. **Complex folder hierarchies** - Flat structure + links is better
6. **Orphan notes** - Every note should link to at least 2 others
7. **Analysis paralysis** - Start writing, structure emerges later

## Tools and Plugins

### Core Plugins (Enabled)
- **Graph view**: Visualize connections
- **Backlinks**: See what links to current note
- **Templates**: Quick note creation
- **Search**: Find notes and content
- **Canvas**: Visual diagrams (for network topologies, etc.)

### Recommended Community Plugins
- **Dataview**: Query and display notes dynamically
- **Excalidraw**: Hand-drawn diagrams
- **Calendar**: Daily notes navigation
- **Tag Wrangler**: Tag management

## Language

- **Primary language**: French (content)
- **Technical terms**: English (when standard)
- **Code/Commands**: English
- **Metadata**: English (for consistency)

## Special Considerations

- **Canvas files**: Use for network diagrams, concept maps
- **Images**: Store in `Assets/`, link with `![[image.png]]`
- **Code blocks**: Always specify language for syntax highlighting
- **Callouts**: Use `>[!NOTE]`, `>[!WARNING]`, etc. for emphasis
