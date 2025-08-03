#!/usr/bin/env python3
"""
Greek Locale File Generator
Creates a Greek locale file (el.json) from Bulgarian locale and translation CSV.
"""

import pandas as pd
import json
import os
import sys

def load_translation_mappings(csv_file):
    """Load Bulgarian to Greek translation mappings from CSV"""
    print(f"📖 Loading translations from {csv_file}...")
    
    try:
        df = pd.read_csv(csv_file)
        print(f"   Found {len(df)} translation entries")
        
        # Create mapping from BG to GR
        translations = {}
        for _, row in df.iterrows():
            key = row['key']
            bg_text = str(row['BG']).strip()
            gr_text = str(row['GR']).strip()
            
            # Skip empty translations
            if bg_text and gr_text and bg_text != 'nan' and gr_text != 'nan':
                translations[bg_text] = gr_text
        
        print(f"   Loaded {len(translations)} valid translation pairs")
        return translations
        
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return {}

def translate_value(value, translations, key_path=""):
    """Recursively translate a value using the translation mappings"""
    if isinstance(value, dict):
        # Recursively translate dictionary values
        translated = {}
        for k, v in value.items():
            new_key_path = f"{key_path}.{k}" if key_path else k
            translated[k] = translate_value(v, translations, new_key_path)
        return translated
    elif isinstance(value, str):
        # Try to find exact translation
        if value in translations:
            print(f"   ✓ Translated: '{value}' → '{translations[value]}'")
            return translations[value]
        else:
            # Check for partial matches (for complex strings with HTML/variables)
            for bg_text, gr_text in translations.items():
                if bg_text.strip() == value.strip():
                    print(f"   ✓ Translated (trimmed): '{value}' → '{gr_text}'")
                    return gr_text
            
            # No translation found
            print(f"   ⚠️  No translation for: '{value}' (key: {key_path})")
            return value
    else:
        # Return non-string values as-is
        return value

def create_greek_locale(bg_locale_file, translations, output_file):
    """Create Greek locale file from Bulgarian locale and translations"""
    print(f"\n🔄 Creating Greek locale file...")
    
    try:
        # Load Bulgarian locale
        with open(bg_locale_file, 'r', encoding='utf-8') as f:
            bg_locale = json.load(f)
        
        print(f"   Loaded Bulgarian locale from {bg_locale_file}")
        
        # Translate all values
        print(f"   Translating values...")
        gr_locale = translate_value(bg_locale, translations)
        
        # Save Greek locale
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(gr_locale, f, ensure_ascii=False, indent=2)
        
        print(f"   ✅ Greek locale saved to {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error creating Greek locale: {e}")
        return False

def create_missing_translations_report(translations, bg_locale_file, report_file):
    """Create a report of strings that need manual translation"""
    print(f"\n📋 Creating missing translations report...")
    
    try:
        with open(bg_locale_file, 'r', encoding='utf-8') as f:
            bg_locale = json.load(f)
        
        # Collect all string values from the locale
        def collect_strings(obj, path=""):
            strings = []
            if isinstance(obj, dict):
                for k, v in obj.items():
                    new_path = f"{path}.{k}" if path else k
                    strings.extend(collect_strings(v, new_path))
            elif isinstance(obj, str):
                strings.append((path, obj))
            return strings
        
        all_strings = collect_strings(bg_locale)
        
        # Find untranslated strings
        missing = []
        for key_path, bg_text in all_strings:
            if bg_text.strip() not in translations:
                missing.append({
                    'key': key_path,
                    'bulgarian': bg_text,
                    'greek': ''  # To be filled manually
                })
        
        # Save report
        if missing:
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(missing, f, ensure_ascii=False, indent=2)
            print(f"   📄 Missing translations report: {report_file}")
            print(f"   Found {len(missing)} strings needing manual translation")
        else:
            print(f"   🎉 All strings have translations!")
        
        return missing
        
    except Exception as e:
        print(f"❌ Error creating report: {e}")
        return []

def main():
    print("🇬🇷 Greek Locale File Generator")
    print("=" * 40)
    
    # File paths
    csv_file = "translations_general_website_terms.csv"
    bg_locale_file = "locales/bg-BG.json"
    gr_locale_file = "locales/el.json"
    missing_report = "missing_translations.json"
    
    # Check input files exist
    if not os.path.exists(csv_file):
        print(f"❌ CSV file not found: {csv_file}")
        return False
        
    if not os.path.exists(bg_locale_file):
        print(f"❌ Bulgarian locale file not found: {bg_locale_file}")
        return False
    
    # Load translations
    translations = load_translation_mappings(csv_file)
    if not translations:
        print("❌ No translations loaded")
        return False
    
    # Create Greek locale
    success = create_greek_locale(bg_locale_file, translations, gr_locale_file)
    if not success:
        return False
    
    # Create missing translations report
    missing = create_missing_translations_report(translations, bg_locale_file, missing_report)
    
    print(f"\n🎉 Greek localization completed!")
    print(f"   Greek locale: {gr_locale_file}")
    if missing:
        print(f"   Missing translations: {missing_report}")
        print(f"   Manual work needed: {len(missing)} strings")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)