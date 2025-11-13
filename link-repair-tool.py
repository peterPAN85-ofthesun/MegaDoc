#!/usr/bin/env python3
"""
Obsidian Wiki-Link Repair Tool
Automatically identifies and repairs broken wiki-links in an Obsidian vault.
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple, Set
from difflib import get_close_matches

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

def find_best_match(broken_target: str, note_map: Dict[str, List[Path]]) -> str | None:
    """
    Find the best matching note name for a broken link using fuzzy matching.
    """
    all_notes = list(note_map.keys())

    # Handle path-based links (e.g., "FormationRéseau/Days/Jours2/J2 - Formation Réseau")
    if "/" in broken_target:
        # Extract just the filename
        filename = broken_target.split("/")[-1]
        # Check if this filename exists
        if filename in note_map:
            return filename
        # Check with .md extension
        if f"{filename}.md" in note_map:
            return f"{filename}.md"

    # Try exact match first
    if broken_target in note_map:
        return broken_target
    if f"{broken_target}.md" in note_map:
        return f"{broken_target}.md"

    # Try exact substring matching
    broken_lower = broken_target.lower()
    for note in all_notes:
        note_lower = note.lower()
        if broken_lower in note_lower or note_lower in broken_lower:
            # Prefer notes from 1-Permanent over Archive
            paths = note_map[note]
            if any("1-Permanent" in str(p) for p in paths):
                return note
            if any("2-Maps" in str(p) for p in paths):
                return note

    # Try fuzzy matching
    matches = get_close_matches(broken_target, all_notes, n=1, cutoff=0.6)
    if matches:
        # Verify the match makes sense
        match = matches[0]
        paths = note_map[match]
        if any("1-Permanent" in str(p) or "2-Maps" in str(p) for p in paths):
            return match

    return None

def repair_links_in_file(file_path: Path, broken_links: List[Tuple], note_map: Dict) -> int:
    """
    Repair broken links in a single file.
    Returns number of links repaired.
    """
    content = file_path.read_text(encoding='utf-8')
    original_content = content
    repairs_made = 0

    for full_match, link_target, display_text in broken_links:
        # Find best replacement
        best_match = find_best_match(link_target, note_map)

        if best_match:
            # Build replacement link
            if display_text != link_target:
                # Preserve alias
                new_link = f"[[{best_match}|{display_text}]]"
            else:
                # Simple link
                new_link = f"[[{best_match}]]"

            # Replace in content
            content = content.replace(full_match, new_link)
            repairs_made += 1
            print(f"  Fixed: {full_match} → {new_link}")

    # Write back if changes were made
    if content != original_content:
        file_path.write_text(content, encoding='utf-8')

    return repairs_made

def main():
    """Main repair function."""
    print("=" * 80)
    print("Obsidian Wiki-Link Repair Tool")
    print("=" * 80)
    print(f"\nScanning vault: {VAULT_ROOT}")
    print(f"Folders: {', '.join(FOLDERS_TO_SCAN)}")
    print("\nBuilding note index...")

    note_map = get_all_note_names()
    print(f"Found {len(note_map)} unique note names")

    all_files = get_all_markdown_files()
    print(f"Found {len(all_files)} markdown files")
    print("\n" + "=" * 80)
    print("Scanning for broken links...\n")

    # Statistics
    total_links = 0
    broken_links = 0
    files_with_broken_links = 0
    files_repaired = 0
    total_repairs = 0
    broken_by_file = defaultdict(list)

    # First pass: identify all broken links
    for md_file in all_files:
        try:
            content = md_file.read_text(encoding='utf-8')
            links = extract_wikilinks(content)

            if not links:
                continue

            file_broken_links = []

            for full_match, link_target, display_text in links:
                total_links += 1
                exists, matching_paths = resolve_link(link_target, note_map)

                if not exists:
                    broken_links += 1
                    file_broken_links.append((full_match, link_target, display_text))

            if file_broken_links:
                files_with_broken_links += 1
                broken_by_file[md_file] = file_broken_links

        except Exception as e:
            print(f"Error reading {md_file}: {e}")

    print("=" * 80)
    print("SCAN RESULTS")
    print("=" * 80)
    print(f"\nTotal markdown files scanned: {len(all_files)}")
    print(f"Total wiki-links found: {total_links}")
    print(f"Broken links found: {broken_links}")
    print(f"Files with broken links: {files_with_broken_links}")

    if broken_links == 0:
        print("\n✓ All wiki-links are valid!")
        return

    print("\n" + "=" * 80)
    print("REPAIRING BROKEN LINKS")
    print("=" * 80 + "\n")

    # Second pass: repair broken links
    for file_path in sorted(broken_by_file.keys()):
        rel_path = file_path.relative_to(VAULT_ROOT)
        print(f"\n{rel_path}")
        print("-" * 80)

        repairs = repair_links_in_file(file_path, broken_by_file[file_path], note_map)

        if repairs > 0:
            files_repaired += 1
            total_repairs += repairs
        else:
            print("  (No automatic repairs possible)")

    print("\n" + "=" * 80)
    print("REPAIR SUMMARY")
    print("=" * 80)
    print(f"\nFiles repaired: {files_repaired}")
    print(f"Total links repaired: {total_repairs}")
    print(f"Links still broken: {broken_links - total_repairs}")

    if total_repairs < broken_links:
        print(f"\n⚠ {broken_links - total_repairs} links could not be automatically repaired")
        print("These require manual intervention.")

    print("\n" + "=" * 80)
    print("REPAIR COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()
