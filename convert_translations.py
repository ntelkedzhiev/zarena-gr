#!/usr/bin/env python3
"""
Excel to CSV Translation Converter
Converts translation sheets from Excel files to CSV format for processing.
Usage: python convert_translations.py [excel_file] [sheet_name] [output_csv]
"""

import pandas as pd
import sys
import os

def convert_excel_to_csv(excel_file, sheet_name=None, output_csv=None):
    """
    Convert an Excel sheet to CSV format
    
    Args:
        excel_file (str): Path to the Excel file
        sheet_name (str): Name of the sheet to convert (optional)
        output_csv (str): Output CSV file path (optional)
    """
    try:
        # Check if Excel file exists
        if not os.path.exists(excel_file):
            print(f"Error: Excel file '{excel_file}' not found.")
            return False
            
        # Read the Excel file
        xl_file = pd.ExcelFile(excel_file)
        print(f"Available sheets in '{excel_file}':")
        for i, sheet in enumerate(xl_file.sheet_names, 1):
            print(f"  {i}. {sheet}")
        
        # Determine which sheet to use
        if sheet_name is None:
            # Try to find "General website terms" or similar
            target_sheet = None
            for sheet in xl_file.sheet_names:
                if 'general' in sheet.lower() and ('website' in sheet.lower() or 'terms' in sheet.lower()):
                    target_sheet = sheet
                    break
            
            if target_sheet:
                sheet_name = target_sheet
                print(f"\nAuto-detected sheet: '{sheet_name}'")
            else:
                print(f"\nCould not auto-detect 'General website terms' sheet.")
                print("Please specify the sheet name as a parameter.")
                return False
        else:
            if sheet_name not in xl_file.sheet_names:
                print(f"Error: Sheet '{sheet_name}' not found in the Excel file.")
                return False
        
        # Read the specified sheet
        print(f"\nReading sheet: '{sheet_name}'...")
        df = pd.read_excel(excel_file, sheet_name=sheet_name)
        
        # Set default output filename if not provided
        if output_csv is None:
            base_name = os.path.splitext(excel_file)[0]
            sheet_safe = sheet_name.lower().replace(' ', '_').replace('-', '_')
            output_csv = f"{base_name}_{sheet_safe}.csv"
        
        # Save to CSV
        df.to_csv(output_csv, index=False, encoding='utf-8')
        
        print(f"\n✅ Successfully converted!")
        print(f"   Input:  {excel_file} -> {sheet_name}")
        print(f"   Output: {output_csv}")
        print(f"   Shape:  {df.shape[0]} rows, {df.shape[1]} columns")
        
        # Show column names
        print(f"\nColumns found:")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i}. {col}")
        
        # Show first few rows as sample
        print(f"\nFirst 3 rows (sample):")
        print(df.head(3).to_string(index=False, max_cols=5))
        
        return True
        
    except ImportError as e:
        print(f"Error: Required Python packages not installed.")
        print(f"Please install: pip install pandas openpyxl")
        print(f"Details: {e}")
        return False
    except Exception as e:
        print(f"Error converting Excel file: {e}")
        return False

def main():
    # Parse command line arguments
    if len(sys.argv) < 2:
        excel_file = "translations.xlsx"  # Default file
    else:
        excel_file = sys.argv[1]
    
    sheet_name = sys.argv[2] if len(sys.argv) > 2 else None
    output_csv = sys.argv[3] if len(sys.argv) > 3 else None
    
    print("🔄 Excel to CSV Translation Converter")
    print("=" * 40)
    
    success = convert_excel_to_csv(excel_file, sheet_name, output_csv)
    
    if success:
        print(f"\n🎉 Conversion completed successfully!")
        print(f"You can now process the CSV file for translations.")
    else:
        print(f"\n❌ Conversion failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()