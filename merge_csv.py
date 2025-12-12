#!/usr/bin/env python3
"""
CSV Merge Script
Merges medicines.csv and allowed.csv files.
Priority: allowed.csv - if medicine name exists in both files, 
the entry from allowed.csv will be used.
"""

import csv
from collections import OrderedDict


def read_csv_file(filename):
    """Read CSV file and return list of dictionaries."""
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        return list(reader)


def merge_csv_files(medicines_file, allowed_file, output_file):
    """
    Merge two CSV files with priority given to allowed_file.
    Keeps all records from medicines.csv and only replaces those 
    with matching names from allowed.csv.
    """
    # Read both CSV files
    print(f"Reading {medicines_file}...")
    medicines_data = read_csv_file(medicines_file)
    print(f"Found {len(medicines_data)} records in medicines.csv")

    print(f"Reading {allowed_file}...")
    allowed_data = read_csv_file(allowed_file)
    print(f"Found {len(allowed_data)} records in allowed.csv")

    # Create a lookup dictionary for allowed medicines by name
    # Key: medicine name (lowercase for case-insensitive comparison)
    allowed_dict = {}
    for record in allowed_data:
        name_key = record['name'].strip().lower()
        allowed_dict[name_key] = record

    # Result list to maintain original order
    merged_list = []
    replaced_count = 0

    # Process all medicines from medicines.csv
    for record in medicines_data:
        name_key = record['name'].strip().lower()

        # If this medicine exists in allowed.csv, use that version instead
        if name_key in allowed_dict:
            merged_list.append(allowed_dict[name_key])
            replaced_count += 1
        else:
            merged_list.append(record)

    # Add any medicines from allowed.csv that weren't in medicines.csv
    medicines_names = {rec['name'].strip().lower() for rec in medicines_data}
    for record in allowed_data:
        name_key = record['name'].strip().lower()
        if name_key not in medicines_names:
            merged_list.append(record)

    # Get all fieldnames from both files
    medicines_fields = set(
        medicines_data[0].keys()) if medicines_data else set()
    allowed_fields = set(allowed_data[0].keys()) if allowed_data else set()
    all_fields = list(medicines_fields.union(allowed_fields))

    # Write merged data to output file
    print(f"Writing merged data to {output_file}...")
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=all_fields, delimiter=';')
        writer.writeheader()

        for record in merged_list:
            # Ensure all fields are present (fill missing with empty string)
            complete_record = {field: record.get(
                field, '') for field in all_fields}
            writer.writerow(complete_record)

    print(f"Merge complete!")
    print(f"Total records: {len(merged_list)}")
    print(f"Records replaced from allowed.csv: {replaced_count}")
    print(f"Output saved to: {output_file}")


if __name__ == "__main__":
    medicines_file = "medicines.csv"
    allowed_file = "allowed.csv"
    output_file = "merged_medicines.csv"

    merge_csv_files(medicines_file, allowed_file, output_file)
