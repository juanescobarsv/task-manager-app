import os
import xml.etree.ElementTree as ET
from xml.dom import minidom # Import minidom

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
                # Parse the SVG file using ElementTree
                tree = ET.parse(file_path)
                root = tree.getroot()

                # Iterate through all elements and remove 'fill' attribute
                for elem in root.iter():
                    if 'fill' in elem.attrib:
                        del elem.attrib['fill']

                # --- Namespace Cleaning ---
                # ElementTree often introduces ns0: when writing default namespaces.
                # To combat this, we'll manually ensure the root SVG element
                # has the correct 'xmlns' attribute without a prefix,
                # and then use minidom for a cleaner output.

                # 1. Ensure the root tag name is 'svg' without a namespace prefix for serialization
                #    If the original tag was like '{http://www.w3.org/2000/svg}svg', convert it.
                if root.tag.startswith('{' + svg_namespace + '}'):
                    root.tag = 'svg'

                # 2. Remove any explicit prefixed xmlns:ns0 attributes that ElementTree might add during parsing
                #    or that were already there. We want a single default xmlns.
                #    Iterate over a copy of the keys to avoid issues when deleting during iteration.
                for attr_name in list(root.attrib.keys()):
                    if attr_name.startswith('xmlns:') and root.attrib[attr_name] == svg_namespace:
                        del root.attrib[attr_name]

                # 3. Ensure the root SVG element has the default xmlns attribute if it's missing
                if 'xmlns' not in root.attrib:
                    root.set('xmlns', svg_namespace)


                # --- Serialize with minidom for cleaner output ---
                # Convert the ElementTree element to a string, then parse with minidom
                # This allows minidom to handle the pretty printing and namespace serialization.
                xml_string = ET.tostring(root, encoding='utf-8').decode('utf-8')
                dom = minidom.parseString(xml_string)

                # Write the pretty-printed XML to the file
                # xml_declaration=False is often preferred for SVGs embedded in HTML
                with open(file_path, 'wb') as f:
                    f.write(dom.toprettyxml(indent="  ", encoding='utf-8', newl='\n'))

                print(f"Successfully updated {filename}")

            except ET.ParseError as e:
                print(f"Error parsing {filename}: {e}. Skipping this file.")
            except Exception as e:
                print(f"An unexpected error occurred with {filename}: {e}. Skipping this file.")

    print("SVG processing complete.")

# --- How to use the script ---
if __name__ == "__main__":
    # IMPORTANT: Replace './src/assets/icons' with the actual path to your icons folder.
    # For example, if your icons are in 'your-project/src/assets/icons',
    # and you run this script from 'your-project/', then './src/assets/icons' is correct.
    svg_folder_path = '../assets/icons' # Adjust this path as needed

    if not os.path.isdir(svg_folder_path):
        print(f"Error: Directory '{svg_folder_path}' not found.")
        print("Please update the 'svg_folder_path' variable in the script to your actual icons folder.")
    else:
        remove_fill_from_svgs(svg_folder_path)

