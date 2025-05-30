import os
import xml.etree.ElementTree as ET
from xml.dom import minidom

# --- When to use this script ---
# When a SVG vector has a default "fill" property hard coded in it.
# The SVG file must be stored in "./src/assets/icons"

# --- How to use the script ---
# In bash terminal go to "./src/scripts".
# Run python3 remove_svg_fills.py

def remove_fill_from_svgs(directory_path):
    """
    Iterates through all SVG files in a given directory, removes
    the 'fill' attribute from all elements, and cleans up namespaces
    to avoid 'ns0:' prefixes.

    Args:
        directory_path (str): The path to the directory containing SVG files.
    """
    print(f"Starting to process SVG files in: {directory_path}")

    svg_namespace = "http://www.w3.org/2000/svg"

    for filename in os.listdir(directory_path):
        if filename.endswith(".svg"):
            file_path = os.path.join(directory_path, filename)
            print(f"Processing {filename}...")
            try:
                tree = ET.parse(file_path)
                root = tree.getroot()

                # Iterate through all elements and remove 'fill' attribute
                # Also, remove the namespace URI from the tag name
                for elem in root.iter():
                    if 'fill' in elem.attrib:
                        del elem.attrib['fill']

                    # Remove namespace URI from tag name if present
                    if elem.tag.startswith('{' + svg_namespace + '}'):
                        elem.tag = elem.tag[len('{' + svg_namespace + '}'):]
                    # Also handle potential 'svg' root tag if it was prefixed
                    elif elem.tag == '{' + svg_namespace + '}svg':
                        elem.tag = 'svg'


                # --- Namespace Cleaning ---
                # ElementTree often introduces ns0: when writing default namespaces.

                # Ensure the root tag name is 'svg' without a namespace prefix for serialization
                if root.tag.startswith('{' + svg_namespace + '}'):
                    root.tag = 'svg'

                # Remove any explicit prefixed xmlns:ns0 attributes that ElementTree might add during parsing
                # or that were already there. We want a single default xmlns.
                for attr_name in list(root.attrib.keys()):
                    if attr_name.startswith('xmlns:') and root.attrib[attr_name] == svg_namespace:
                        del root.attrib[attr_name]

                # Ensure the root SVG element has the default xmlns attribute if it's missing
                if 'xmlns' not in root.attrib:
                    root.set('xmlns', svg_namespace)

                # --- Serialize with minidom for cleaner output ---
                # Convert the ElementTree element to a string, then parse with minidom
                # This allows minidom to handle the pretty printing and namespace serialization.
                xml_string = ET.tostring(root, encoding='utf-8').decode('utf-8')
                dom = minidom.parseString(xml_string)

                # Write the pretty-printed XML to the file
                with open(file_path, 'wb') as f:
                    f.write(dom.toprettyxml(indent="  ", encoding='utf-8', newl='\n'))

                print(f"Successfully updated {filename}")

            except ET.ParseError as e:
                print(f"Error parsing {filename}: {e}. Skipping this file.")
            except Exception as e:
                print(f"An unexpected error occurred with {filename}: {e}. Skipping this file.")

    print("SVG processing complete.")

if __name__ == "__main__":
    # IMPORTANT: You must run this script from the "./src/scripts" folder for the script to work.
    # If not adjust path below
    svg_folder_path = '../assets/icons'

    if not os.path.isdir(svg_folder_path):
        print(f"Error: Directory '{svg_folder_path}' not found.")
        print("Please update the 'svg_folder_path' variable in the script to your actual icons folder.")
    else:
        remove_fill_from_svgs(svg_folder_path)
