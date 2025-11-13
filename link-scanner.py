#!/usr/bin/env python3
"""
Obsidian Wiki-Link Scanner and Validator
Scans all markdown files in an Obsidian vault and validates wiki-links.
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Set

VAULT_ROOT = "/home/gregoire/Documents/ObsidianZettle"
FOLDERS_TO_SCAN = ["0-Inbox", "1-Permanent", "2-Maps", "Templates", "Archive"]

# Pattern to match wiki-links: [[Link]] or [[Link|Display Text]]
WIKILINK_PATTERN = re.compile(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]')

def get_all_markdown_files() -> List[Path]:
    """Get all markdown files in the vault."""
    md_files = []
    vault_path = Path(VAULT_ROOT)

    # Scan specific folders
    for folder in FOLDERS_TO_SCAN:
        folder_path = vault_path / folder
        if folder_path.exists():
            md_files.extend(folder_path.rglob("*.md"))

    # Also scan root directory
    md_files.extend(vault_path.glob("*.md"))

    return sorted(md_files)

def get_all_note_names() -> Dict[str, List[Path]]:
    """
    Build a map of note names to their file paths.
    Handles cases where multiple files have the same name.
    """
    note_map = defaultdict(list)

    for md_file in get_all_markdown_files():
        # Note name without extension
        note_name = md_file.stem
        note_map[note_name].append(md_file)

        # Also map with .md extension
        note_map[md_file.name].append(md_file)

    return note_map

def extract_wikilinks(content: str) -> List[Tuple[str, str, str]]:
    """
    Extract all wiki-links from content.
    Returns list of (full_match, link_target, display_text)
    """
    links = []
    for match in WIKILINK_PATTERN.finditer(content):
        full_match = match.group(0)
        link_target = match.group(1).strip()
        display_text = match.group(2).strip() if match.group(2) else link_target
        links.append((full_match, link_target, display_text))

    return links

def resolve_link(link_target: str, note_map: Dict[str, List[Path]]) -> Tuple[bool, List[Path]]:
    """
    Check if a wiki-link target exists.
    Returns (exists, [matching_paths])
    """
    # Remove .md extension if present
    clean_target = link_target.replace(".md", "")

    # Check direct match
    if clean_target in note_map:
        return True, note_map[clean_target]

    # Check with .md extension
    if f"{clean_target}.md" in note_map:
        return True, note_map[f"{clean_target}.md"]

    # Check case-insensitive
    for note_name, paths in note_map.items():
        if note_name.lower() == clean_target.lower():
            return True, paths

    return False, []

def scan_vault():
    """Main scanning function."""
    print(f"Scanning Obsidian vault: {VAULT_ROOT}")
    print(f"Folders: {', '.join(FOLDERS_TO_SCAN)}")
    print("=" * 80)

    # Build note map
    print("\nBuilding note index...")
    note_map = get_all_note_names()
    print(f"Found {len(note_map)} unique note names")

    # Scan all files
    all_files = get_all_markdown_files()
    print(f"Found {len(all_files)} markdown files")
    print("=" * 80)

    # Statistics
    total_links = 0
    broken_links = 0
    files_with_broken_links = 0
    broken_link_details = []

    # Scan each file
    print("\nScanning files for wiki-links...\n")

    for md_file in all_files:
        try:
            content = md_file.read_text(encoding='utf-8')
            links = extract_wikilinks(content)

            if not links:
                continue

            file_has_broken = False

            for full_match, link_target, display_text in links:
                total_links += 1
                exists, matching_paths = resolve_link(link_target, note_map)

                if not exists:
                    broken_links += 1
                    file_has_broken = True
                    broken_link_details.append({
                        'file': md_file,
                        'link': full_match,
                        'target': link_target,
                        'display': display_text
                    })

            if file_has_broken:
                files_with_broken_links += 1

        except Exception as e:
            print(f"Error reading {md_file}: {e}")

    # Report
    print("=" * 80)
    print("\nSCAN RESULTS")
    print("=" * 80)
    print(f"\nTotal markdown files scanned: {len(all_files)}")
    print(f"Total wiki-links found: {total_links}")
    print(f"Broken links found: {broken_links}")
    print(f"Files with broken links: {files_with_broken_links}")

    if broken_links > 0:
        print("\n" + "=" * 80)
        print("BROKEN LINKS DETAILS")
        print("=" * 80)

        # Group by file
        by_file = defaultdict(list)
        for detail in broken_link_details:
            by_file[detail['file']].append(detail)

        for file_path in sorted(by_file.keys()):
            rel_path = file_path.relative_to(VAULT_ROOT)
            print(f"\n{rel_path}")
            print("-" * 80)

            for detail in by_file[file_path]:
                print(f"  Broken link: {detail['link']}")
                print(f"    Target: {detail['target']}")

                # Try to suggest fixes
                suggestions = find_similar_notes(detail['target'], note_map)
                if suggestions:
                    print(f"    Suggestions:")
                    for suggestion in suggestions[:3]:
                        print(f"      - {suggestion}")
                print()

    else:
        print("\n✓ All wiki-links are valid!")

    print("\n" + "=" * 80)
    print("SCAN COMPLETE")
    print("=" * 80)

def find_similar_notes(target: str, note_map: Dict[str, List[Path]]) -> List[str]:
    """Find similar note names for broken links."""
    suggestions = []
    target_lower = target.lower()

    # Look for partial matches
    for note_name in note_map.keys():
        note_lower = note_name.lower()

        # Exact substring match
        if target_lower in note_lower or note_lower in target_lower:
            suggestions.append(note_name)

        # Word-based similarity
        target_words = set(target_lower.split())
        note_words = set(note_lower.split())
        if target_words & note_words:  # Intersection
            suggestions.append(note_name)

    return sorted(set(suggestions))

if __name__ == "__main__":
    scan_vault()
